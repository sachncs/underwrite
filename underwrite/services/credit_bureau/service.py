"""Credit Bureau & CKYC service — pulls credit reports and verifies CKYC.

Integrates with CIBIL, Experian, Equifax for credit bureau checks and
the CKYC registry for identity verification per RBI guidelines.
"""

from __future__ import annotations

from typing import Any

from underwrite.__events__ import Event, EventType
from underwrite.__logger__ import logger
from underwrite.services.base import StatefulService
from underwrite.services.credit_bureau.client import (
    CreditBureauClient,
    CreditReport,
    HttpCreditBureauClient,
    MockCreditBureauClient,
)
from underwrite.services.persistence import TypedStoreRepository


class CreditBureauService(StatefulService):
    """Pulls credit bureau reports and verifies CKYC identity.

    Delegates HTTP calls to the configured *CreditBureauClient*.
    Caches reports and CKYC responses in-memory with store persistence.
    """

    def __init__(self, **kwargs: Any) -> None:
        super().__init__(**kwargs)
        self._client: CreditBureauClient = self._build_client(**kwargs)
        self._reports: dict[str, CreditReport] = {}
        self._ckyc_records: dict[str, dict[str, Any]] = {}
        self._repo: TypedStoreRepository[dict[str, Any]] = self.store_repo(
            "credit_bureau", dict)
        loaded = self._repo.load(default={})
        if loaded:
            self._reports = {
                k: self._dict_to_report(v)
                for k, v in loaded.get("reports", {}).items()
            }
            self._ckyc_records = loaded.get("ckyc", {})

    @staticmethod
    def _dict_to_report(d: dict[str, Any]) -> CreditReport:
        from underwrite.services.credit_bureau.client import (
            BureauAccount, BureauEnquiry)
        accounts = [
            BureauAccount(**a) for a in d.get("accounts", [])
        ]
        enquiries = [
            BureauEnquiry(**e) for e in d.get("enquiries", [])
        ]
        return CreditReport(
            bureau=d["bureau"],
            pan=d["pan"],
            name=d.get("name", ""),
            dob=d.get("dob", ""),
            score=d.get("score", 0),
            score_factors=d.get("score_factors", []),
            accounts=accounts,
            enquiries=enquiries,
            total_credit_limit=d.get("total_credit_limit", 0.0),
            total_balance=d.get("total_balance", 0.0),
            credit_utilization_pct=d.get("credit_utilization_pct", 0.0),
            active_accounts=d.get("active_accounts", 0),
            delinquent_accounts=d.get("delinquent_accounts", 0),
            credit_age_years=d.get("credit_age_years", 0.0),
            report_date=d.get("report_date", ""),
        )

    def _build_client(self, **kwargs: Any) -> CreditBureauClient:
        api_key = kwargs.get("cibil_api_key", "")
        if api_key:
            return HttpCreditBureauClient(cibil_api_key=api_key)
        logger.info("no bureau credentials configured, using mock client")
        return MockCreditBureauClient()

    def handle(self, event: Event) -> None:
        if event.event_type == EventType.CREDIT_BUREAU_CHECK:
            self._check_bureau(event)
        elif event.event_type == EventType.CKYC_VERIFY:
            self._verify_ckyc(event)

    def _check_bureau(self, event: Event) -> None:
        pan: str = event.payload.get("pan", "")
        bureau: str = event.payload.get("bureau", "cibil")
        if not pan:
            logger.warning("credit_bureau.check missing pan")
            return
        try:
            report = self._client.fetch_credit_report(pan, bureau)
        except Exception as exc:
            logger.error("credit_bureau.check failed for %s: %s", pan, exc)
            self.emit(EventType.CREDIT_BUREAU_CHECK_FAILED, {
                "pan": pan,
                "bureau": bureau,
                "error": str(exc),
            },
                      correlation_id=event.correlation_id)
            return
        with self.state_lock:
            self._reports[pan] = report
            self._sync()
        self.emit(EventType.CREDIT_BUREAU_CHECKED, {
            "pan": pan,
            "bureau": bureau,
            "score": report.score,
            "active_accounts": report.active_accounts,
            "delinquent_accounts": report.delinquent_accounts,
            "credit_utilization_pct": report.credit_utilization_pct,
            "credit_age_years": report.credit_age_years,
            "total_balance": report.total_balance,
        },
                  correlation_id=event.correlation_id)

    def _verify_ckyc(self, event: Event) -> None:
        ckyc_number: str = event.payload.get("ckyc_number", "")
        aadhaar: str = event.payload.get("aadhaar", "")
        if not ckyc_number or not aadhaar:
            logger.warning("ckyc.verify missing ckyc_number or aadhaar")
            return
        try:
            response = self._client.verify_ckyc(ckyc_number, aadhaar)
        except Exception as exc:
            logger.error("ckyc.verify failed for %s: %s", ckyc_number, exc)
            self.emit(EventType.CKYC_REJECTED, {
                "ckyc_number": ckyc_number,
                "error": str(exc),
            },
                      correlation_id=event.correlation_id)
            return
        with self.state_lock:
            self._ckyc_records[ckyc_number] = {
                "ckyc_number": response.ckyc_number,
                "name": response.name,
                "dob": response.dob,
                "gender": response.gender,
                "pan": response.pan,
                "aadhaar_verified": response.aadhaar_verified,
                "address": response.address,
                "status": response.status,
                "verified_at": response.verified_at,
            }
            self._sync()
        self.emit(EventType.CKYC_VERIFIED, {
            "ckyc_number": ckyc_number,
            "name": response.name,
            "status": response.status,
        },
                  correlation_id=event.correlation_id)

    def get_report(self, pan: str) -> CreditReport | None:
        with self.state_lock:
            return self._reports.get(pan)

    def get_ckyc(self, ckyc_number: str) -> dict[str, Any] | None:
        with self.state_lock:
            return self._ckyc_records.get(ckyc_number)

    def health_check(self) -> dict[str, Any]:
        base = super().health_check()
        base["reports_cached"] = len(self._reports)
        base["ckyc_records"] = len(self._ckyc_records)
        return base

    def _sync(self) -> None:
        reports_dict = {
            k: self._report_to_dict(v)
            for k, v in self._reports.items()
        }
        self._repo.save({
            "reports": reports_dict,
            "ckyc": self._ckyc_records,
        })

    @staticmethod
    def _report_to_dict(r: CreditReport) -> dict[str, Any]:
        return {
            "bureau": r.bureau,
            "pan": r.pan,
            "name": r.name,
            "dob": r.dob,
            "score": r.score,
            "score_factors": r.score_factors,
            "accounts": [{
                "lender": a.lender,
                "account_type": a.account_type,
                "account_number": a.account_number,
                "opened_date": a.opened_date,
                "last_reported_date": a.last_reported_date,
                "current_balance": a.current_balance,
                "sanction_amount": a.sanction_amount,
                "emi_amount": a.emi_amount,
                "days_past_due": a.days_past_due,
                "status": a.status,
                "written_off": a.written_off,
                "settled": a.settled,
            } for a in r.accounts],
            "enquiries": [{
                "lender": e.lender,
                "date": e.date,
                "amount": e.amount,
                "purpose": e.purpose,
            } for e in r.enquiries],
            "total_credit_limit": r.total_credit_limit,
            "total_balance": r.total_balance,
            "credit_utilization_pct": r.credit_utilization_pct,
            "active_accounts": r.active_accounts,
            "delinquent_accounts": r.delinquent_accounts,
            "credit_age_years": r.credit_age_years,
            "report_date": r.report_date,
        }
