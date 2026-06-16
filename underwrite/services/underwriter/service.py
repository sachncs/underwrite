"""Underwriter — evaluates loan applications using rule engine.

Enhanced service that aggregates signals from risk, fraud, credit bureau,
AML/KYC and applies configurable rules to produce graded decisions.
"""

from __future__ import annotations

from typing import Any, Callable

from underwrite.__events__ import Event, EventType
from underwrite.__logger__ import logger
from underwrite.services.base import StatefulService
from underwrite.services.persistence import TypedStoreRepository
from underwrite.services.underwriter.engine import (
    DecisionOutcome,
    Policy,
    Rule,
    RuleCategory,
    RuleEngine,
    RuleSeverity,
    UnderwritingDecision,
)
from underwrite.validate import get_finite, get_non_empty


DEFAULT_RULES: list[Rule] = [
    Rule(
        rule_id="principal_positive",
        category=RuleCategory.PRINCIPAL.value,
        field="principal",
        operator="gt",
        value=0,
        severity=RuleSeverity.CRITICAL.value,
        message="Principal must be positive",
    ),
    Rule(
        rule_id="principal_max",
        category=RuleCategory.PRINCIPAL.value,
        field="principal",
        operator="lte",
        value=10_000_000,
        severity=RuleSeverity.HIGH.value,
        message="Principal exceeds maximum",
    ),
    Rule(
        rule_id="principal_min",
        category=RuleCategory.PRINCIPAL.value,
        field="principal",
        operator="gte",
        value=1_000,
        severity=RuleSeverity.HIGH.value,
        message="Principal below minimum",
    ),
    Rule(
        rule_id="default_probability_max",
        category=RuleCategory.DEFAULT_PROBABILITY.value,
        field="default_probability",
        operator="lte",
        value=0.25,
        severity=RuleSeverity.CRITICAL.value,
        message="Default probability exceeds threshold",
    ),
    Rule(
        rule_id="credit_score_min",
        category=RuleCategory.CREDIT_SCORE.value,
        field="credit_score",
        operator="gte",
        value=650,
        severity=RuleSeverity.HIGH.value,
        message="Credit score below minimum",
    ),
    Rule(
        rule_id="dti_max",
        category=RuleCategory.DTI.value,
        field="dti_ratio",
        operator="lte",
        value=0.5,
        severity=RuleSeverity.HIGH.value,
        message="Debt-to-income ratio exceeds limit",
    ),
    Rule(
        rule_id="ltv_max",
        category=RuleCategory.LTV.value,
        field="ltv_ratio",
        operator="lte",
        value=0.8,
        severity=RuleSeverity.HIGH.value,
        message="Loan-to-value ratio exceeds limit",
    ),
    Rule(
        rule_id="tenor_max",
        category=RuleCategory.TENOR.value,
        field="tenor_months",
        operator="lte",
        value=360,
        severity=RuleSeverity.MEDIUM.value,
        message="Tenor exceeds maximum",
    ),
    Rule(
        rule_id="fraud_flag",
        category=RuleCategory.FRAUD.value,
        field="fraud_signals",
        operator="eq",
        value=0,
        severity=RuleSeverity.CRITICAL.value,
        message="Fraud signals detected",
    ),
    Rule(
        rule_id="aml_cleared",
        category=RuleCategory.COMPLIANCE.value,
        field="aml_status",
        operator="eq",
        value="cleared",
        severity=RuleSeverity.CRITICAL.value,
        message="AML check not cleared",
    ),
    Rule(
        rule_id="kyc_verified",
        category=RuleCategory.COMPLIANCE.value,
        field="kyc_status",
        operator="eq",
        value="verified",
        severity=RuleSeverity.CRITICAL.value,
        message="KYC not verified",
    ),
]

DEFAULT_POLICIES: list[Policy] = [
    Policy(
        policy_id="auto_approve",
        description="Auto-approve when no high-severity rules fail",
        rule_ids=[r.rule_id for r in DEFAULT_RULES],
        logic="all",
        action=DecisionOutcome.APPROVED.value,
        priority=10,
    ),
]


class UnderwriterService(StatefulService):
    """Evaluates loan applications using a configurable rule engine.

    Accumulates facts from multiple signal events (risk, fraud, credit bureau,
    AML, KYC) and evaluates rules to produce a graded decision.
    """

    def __init__(self, **kwargs: Any) -> None:
        super().__init__(**kwargs)
        self._engine = RuleEngine(rules=list(DEFAULT_RULES),
                                  policies=list(DEFAULT_POLICIES))
        self._applications: dict[str, dict[str, Any]] = {}
        self._repo: TypedStoreRepository[dict[str, Any]] = self.store_repo(
            "underwriter", dict)
        loaded = self._repo.load(default={})
        if loaded:
            self._applications = loaded.get("applications", {})

    def add_rule(self, rule: Rule) -> None:
        self._engine.add_rule(rule)

    def add_policy(self, policy: Policy) -> None:
        self._engine.add_policy(policy)

    def handle(self, event: Event) -> None:
        if event.event_type == EventType.UNDERWRITE_REQUEST:
            self._handle_request(event)
        elif event.event_type == EventType.RISK_SCORED:
            self._accumulate(event, "risk_score",
                             lambda p: p.get("score", 0))
        elif event.event_type == EventType.FRAUD_ALERT:
            self._accumulate_signal(event, "fraud_signals")
        elif event.event_type == EventType.CREDIT_BUREAU_CHECKED:
            self._accumulate_bureau(event)
        elif event.event_type == EventType.AML_CLEARED:
            self._accumulate(event, "aml_status",
                             lambda p: "cleared")
        elif event.event_type == EventType.AML_FROZEN:
            self._accumulate(event, "aml_status",
                             lambda p: "frozen")
        elif event.event_type == EventType.KYC_VERIFIED:
            self._accumulate(event, "kyc_status",
                             lambda p: "verified")
        elif event.event_type == EventType.KYC_REJECTED:
            self._accumulate(event, "kyc_status",
                             lambda p: "rejected")
        elif event.event_type == EventType.DECISION_MADE:
            self._accumulate(event, "decision_action",
                             lambda p: p.get("action", ""))

    def _accumulate(
        self,
        event: Event,
        key: str,
        extractor: Callable[[dict[str, Any]], Any],
    ) -> None:
        app_id = event.payload.get("application_id",
                                   event.payload.get("entity_id", ""))
        if not app_id:
            app_id = event.payload.get("loan_id", "")
        if not app_id:
            return
        with self.state_lock:
            if app_id not in self._applications:
                self._applications[app_id] = {}
            self._applications[app_id][key] = extractor(event.payload)
            self._sync()

    def _accumulate_signal(self, event: Event, key: str) -> None:
        app_id = event.payload.get("application_id",
                                   event.payload.get("entity_id", ""))
        if not app_id:
            return
        with self.state_lock:
            if app_id not in self._applications:
                self._applications[app_id] = {}
            current = self._applications[app_id].get(key, 0)
            self._applications[app_id][key] = current + 1
            self._sync()

    def _accumulate_bureau(self, event: Event) -> None:
        app_id = event.payload.get("application_id",
                                   event.payload.get("entity_id", ""))
        if not app_id:
            app_id = event.payload.get("pan", "")
        if not app_id:
            return
        with self.state_lock:
            if app_id not in self._applications:
                self._applications[app_id] = {}
            self._applications[app_id].update({
                "credit_score":
                event.payload.get("score", 0),
                "credit_utilization_pct":
                event.payload.get("credit_utilization_pct", 0),
                "delinquent_accounts":
                event.payload.get("delinquent_accounts", 0),
            })
            self._sync()

    def _handle_request(self, event: Event) -> None:
        p = event.payload
        app_id: str = p.get("application_id", "") or event.correlation_id
        borrower: str = get_non_empty(p, "borrower", "")
        principal: float = get_finite(p, "principal", 0.0)
        dp: float = get_finite(p, "default_probability", 0.0)

        if not borrower:
            logger.warning("underwrite.request missing borrower")
            return

        with self.state_lock:
            facts: dict[str, Any] = self._applications.get(app_id, {})
            facts.update({
                "application_id": app_id,
                "borrower": borrower,
                "principal": principal,
                "default_probability": dp,
                "tenor_months": p.get("tenor_months", 0),
                "dti_ratio": p.get("dti_ratio", 0.0),
                "ltv_ratio": p.get("ltv_ratio", 0.0),
                "credit_score": facts.get("credit_score",
                                          p.get("credit_score", 0)),
                "fraud_signals": facts.get("fraud_signals", 0),
                "aml_status": facts.get("aml_status",
                                        p.get("aml_status", "")),
                "kyc_status": facts.get("kyc_status",
                                        p.get("kyc_status", "")),
                "purpose": p.get("purpose", ""),
            })
            self._applications[app_id] = facts
            self._sync()

        decision = self._engine.evaluate(app_id, facts)
        self._emit_decision(decision, event.correlation_id)

    def _emit_decision(
        self,
        decision: UnderwritingDecision,
        correlation_id: str,
    ) -> None:
        payload: dict[str, Any] = {
            "application_id": decision.application_id,
            "outcome": decision.outcome,
            "reasons": decision.reasons,
            "conditions": decision.conditions,
            "rule_results": [
                {
                    "rule_id": r.rule_id,
                    "passed": r.passed,
                    "severity": r.severity,
                    "message": r.message,
                } for r in decision.rule_results
            ],
        }

        # Emit per-rule violation events for granular tracking
        for r in decision.rule_results:
            if not r.passed:
                self.emit(
                    EventType.UNDERWRITE_RULE_VIOLATED,
                    {
                        "application_id": decision.application_id,
                        "rule_id": r.rule_id,
                        "category": r.category,
                        "severity": r.severity,
                        "message": r.message,
                        "actual": r.actual,
                        "threshold": r.threshold,
                    },
                    correlation_id=correlation_id,
                )

        if decision.outcome == DecisionOutcome.APPROVED.value:
            self.emit(EventType.UNDERWRITER_APPROVED,
                      payload,
                      correlation_id=correlation_id)
        elif decision.outcome == DecisionOutcome.APPROVED_WITH_CONDITIONS.value:
            self.emit(EventType.UNDERWRITER_CONDITIONAL_APPROVED,
                      payload,
                      correlation_id=correlation_id)
        elif decision.outcome == DecisionOutcome.REVIEW.value:
            self.emit(EventType.UNDERWRITER_REVIEW,
                      payload,
                      correlation_id=correlation_id)
        elif decision.outcome == DecisionOutcome.ESCALATE.value:
            self.emit(EventType.UNDERWRITER_ESCALATED,
                      payload,
                      correlation_id=correlation_id)
        else:
            self.emit(EventType.UNDERWRITER_REJECTED,
                      payload,
                      correlation_id=correlation_id)

    def get_application(self, app_id: str) -> dict[str, Any] | None:
        with self.state_lock:
            return self._applications.get(app_id)

    def evaluate_facts(
        self,
        app_id: str,
        facts: dict[str, Any],
    ) -> UnderwritingDecision:
        return self._engine.evaluate(app_id, facts)

    def health_check(self) -> dict[str, Any]:
        base = super().health_check()
        base["applications_in_progress"] = len(self._applications)
        base["rules_loaded"] = len(
            self._engine._rules)  # type: ignore[attr-defined]
        return base

    def _sync(self) -> None:
        self._repo.save({"applications": self._applications})
