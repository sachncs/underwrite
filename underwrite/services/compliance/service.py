"""Compliance — RBI-compliant KYC/AML checks for Indian fintech.

Verifies PAN (format + category), Aadhaar (Verhoeff check digit),
screens against AML blocklists with risk scoring, and emits CKYC
and video-KYC event hooks per RBI Digital Lending Guidelines.
"""

from __future__ import annotations

import json
import os
import re
from pathlib import Path
from typing import Any

from underwrite.__events__ import Event, EventType
from underwrite.__logger__ import logger
from underwrite.services.base import StatefulService
from underwrite.services.persistence import TypedStoreRepository

PAN_PATTERN: str = r"^[A-Z]{5}[0-9]{4}[A-Z]$"
PAN_CATEGORIES: dict[str, str] = {
    "A": "Association of Persons",
    "B": "Body of Individuals",
    "C": "Company",
    "F": "Firm",
    "G": "Government Agency",
    "H": "Hindu Undivided Family",
    "L": "Local Authority",
    "J": "Artificial Juridical Person",
    "P": "Individual",
    "T": "Trust",
}

AADHAAR_PATTERN: str = r"^\d{12}$"
BLOCKLIST_PATH: str = "aml_blocklist.json"

AML_RISK_WEIGHTS: dict[str, int] = {
    "pep": 3,
    "politically exposed": 3,
    "sanctions": 5,
    "watchlist": 5,
    "terror": 5,
    "terrorist": 5,
    "money laundering": 5,
    "fraud": 4,
    "scam": 4,
    "shell company": 4,
    "offshore": 3,
    "high risk": 3,
    "adverse media": 3,
    "criminal": 5,
    "corruption": 4,
    "bribery": 4,
    "PEP": 3,
}

AML_LOW_THRESHOLD: int = 3
AML_MEDIUM_THRESHOLD: int = 7


def _load_blocklist(path: str) -> set[str]:
    p = Path(path)
    if not p.exists():
        return set()
    try:
        with open(p) as fh:
            data = json.load(fh)
        if isinstance(data, list):
            return {entry.strip().lower() for entry in data if entry}
        logger.warning("aml_blocklist must be a JSON list, got %s", type(data))
    except (json.JSONDecodeError, OSError) as exc:
        logger.warning("failed to load AML blocklist %s: %s", path, exc)
    return set()


VERHOEFF_D: tuple[tuple[int, ...], ...] = (
    (0, 1, 2, 3, 4, 5, 6, 7, 8, 9),
    (1, 2, 3, 4, 0, 6, 7, 8, 9, 5),
    (2, 3, 4, 0, 1, 7, 8, 9, 5, 6),
    (3, 4, 0, 1, 2, 8, 9, 5, 6, 7),
    (4, 0, 1, 2, 3, 9, 5, 6, 7, 8),
    (5, 9, 8, 7, 6, 0, 4, 3, 2, 1),
    (6, 5, 9, 8, 7, 1, 0, 4, 3, 2),
    (7, 6, 5, 9, 8, 2, 1, 0, 4, 3),
    (8, 7, 6, 5, 9, 3, 2, 1, 0, 4),
    (9, 8, 7, 6, 5, 4, 3, 2, 1, 0),
)

VERHOEFF_P: tuple[tuple[int, ...], ...] = (
    (0, 1, 2, 3, 4, 5, 6, 7, 8, 9),
    (1, 5, 7, 6, 2, 8, 3, 0, 9, 4),
    (5, 8, 0, 3, 7, 9, 6, 1, 4, 2),
    (8, 9, 1, 6, 0, 4, 3, 5, 2, 7),
    (9, 4, 5, 3, 1, 2, 6, 8, 7, 0),
    (4, 2, 8, 6, 5, 7, 3, 9, 0, 1),
    (2, 7, 9, 3, 8, 0, 6, 4, 1, 5),
    (7, 0, 4, 6, 9, 1, 3, 2, 5, 8),
)

VERHOEFF_INV: tuple[int, ...] = (0, 4, 3, 2, 1, 5, 6, 7, 8, 9)


def _verify_aadhaar_checksum(aadhaar: str) -> bool:
    if not re.match(AADHAAR_PATTERN, aadhaar):
        return False
    c = 0
    digits = [int(d) for d in aadhaar]
    for i, digit in enumerate(reversed(digits)):
        c = VERHOEFF_D[c][VERHOEFF_P[(i + 1) % 8][digit]]
    return c == 0


def _pans_category(pan: str) -> str:
    code = pan[3]
    return PAN_CATEGORIES.get(code, "Unknown")


class ComplianceService(StatefulService):
    """RBI-compliant KYC/AML verification with risk scoring."""

    def __init__(self, **kwargs: Any) -> None:
        self.__aml_blocklist_path: str = kwargs.pop(
            "aml_blocklist_path", os.environ.get("AML_BLOCKLIST_PATH", BLOCKLIST_PATH))
        super().__init__(**kwargs)
        self.__blocklist: set[str] = _load_blocklist(self.__aml_blocklist_path)
        self.__kyc_records: dict[str, dict[str, Any]] = {}
        self._repo: TypedStoreRepository[dict[str, Any]] = self.store_repo("compliance", dict)
        loaded = self._repo.load(default={})
        if loaded:
            self.__kyc_records = loaded.get("kyc_records", {})

    def handle(self, event: Event) -> None:
        if event.event_type == EventType.USER_ADDED:
            self._on_user_added(event)
        elif event.event_type == EventType.CKYC_VERIFIED:
            self._on_ckyc_verified(event)
        elif event.event_type == "kyc.video_verified":
            self._on_video_kyc_done(event)

    def _on_user_added(self, event: Event) -> None:
        user: str = event.payload.get("user", "")
        pan: str = event.payload.get("pan", "").upper()
        aadhaar: str = event.payload.get("aadhaar", "")
        name: str = event.payload.get("name", user)
        consent_id: str = event.payload.get("consent_id", "")

        if consent_id and not self._check_consent(user, consent_id):
            self.emit(EventType.KYC_REJECTED, {
                "user": user,
                "kyc_status": "rejected",
                "reason": "consent_not_given",
            }, correlation_id=event.correlation_id)
            return

        if not re.match(PAN_PATTERN, pan):
            self.emit(EventType.KYC_REJECTED, {
                "user": user,
                "kyc_status": "rejected",
                "reason": "invalid_pan_format",
            }, correlation_id=event.correlation_id)
            return

        pan_category = _pans_category(pan)

        if not _verify_aadhaar_checksum(aadhaar):
            self.emit(EventType.KYC_REJECTED, {
                "user": user,
                "kyc_status": "rejected",
                "reason": "invalid_aadhaar_checksum",
            }, correlation_id=event.correlation_id)
            return

        kyc_data: dict[str, Any] = {
            "user": user,
            "pan": pan,
            "pan_category": pan_category,
            "aadhaar": aadhaar[-4:],
            "aadhaar_verified": True,
            "name": name,
            "kyc_status": "format_verified",
            "ckyc_status": "pending",
            "video_kyc_status": "pending",
            "verified_at": event.timestamp,
        }

        with self.state_lock:
            self.__kyc_records[user] = kyc_data
            self.__sync()

        self.emit(EventType.KYC_VERIFIED, {
            "user": user,
            "kyc_status": "format_verified",
            "pan_category": pan_category,
            "aadhaar_last4": aadhaar[-4:],
        }, correlation_id=event.correlation_id)

        self.emit(EventType.CKYC_VERIFY, {
            "user": user,
            "ckyc_number": event.payload.get("ckyc_number", ""),
            "aadhaar": aadhaar,
            "pan": pan,
            "name": name,
        }, correlation_id=event.correlation_id)

        risk_score = self.__screen(name, user, event)
        if risk_score >= AML_MEDIUM_THRESHOLD:
            self.emit(EventType.AML_FROZEN, {
                "user": user,
                "aml_status": "frozen",
                "risk_score": risk_score,
                "reason": "high_risk_aml_screening",
            }, correlation_id=event.correlation_id)
            with self.state_lock:
                if user in self.__kyc_records:
                    self.__kyc_records[user]["aml_status"] = "frozen"
                    self.__kyc_records[user]["aml_risk_score"] = risk_score
                    self.__sync()
        elif risk_score >= AML_LOW_THRESHOLD:
            self.emit("aml.flagged", {
                "user": user,
                "aml_status": "flagged",
                "risk_score": risk_score,
                "reason": "medium_risk_aml_screening",
            }, correlation_id=event.correlation_id)
            with self.state_lock:
                if user in self.__kyc_records:
                    self.__kyc_records[user]["aml_status"] = "flagged"
                    self.__kyc_records[user]["aml_risk_score"] = risk_score
                    self.__sync()
            self.emit(EventType.AML_CLEARED, {
                "user": user,
                "aml_status": "flagged_review",
            }, correlation_id=event.correlation_id)
        else:
            self.emit(EventType.AML_CLEARED, {
                "user": user,
                "aml_status": "clear",
            }, correlation_id=event.correlation_id)
            with self.state_lock:
                if user in self.__kyc_records:
                    self.__kyc_records[user]["aml_status"] = "clear"
                    self.__sync()

        self.emit("kyc.video_initiated", {
            "user": user,
            "video_kyc_status": "pending",
        }, correlation_id=event.correlation_id)

    def _on_ckyc_verified(self, event: Event) -> None:
        user: str = event.payload.get("user", "")
        status: str = event.payload.get("status", "")
        with self.state_lock:
            if user in self.__kyc_records:
                self.__kyc_records[user]["ckyc_status"] = status
                self.__sync()

    def _on_video_kyc_done(self, event: Event) -> None:
        user: str = event.payload.get("user", "")
        status: str = event.payload.get("status", "")
        with self.state_lock:
            if user in self.__kyc_records:
                self.__kyc_records[user]["video_kyc_status"] = status
                self.__sync()

    def _check_consent(self, user: str, consent_id: str) -> bool:
        return bool(consent_id)

    def __screen(self, name: str, user: str, event: Event) -> int:
        name_lower: str = name.lower().strip()
        user_lower: str = user.lower().strip()
        risk_score: int = 0

        for blocked in self.__blocklist:
            if blocked in name_lower or blocked in user_lower:
                risk_score += 8

        text = f"{name_lower} {user_lower}"
        for keyword, weight in AML_RISK_WEIGHTS.items():
            if keyword.lower() in text:
                risk_score += weight

        return risk_score

    def get_kyc_status(self, user: str) -> dict[str, Any] | None:
        with self.state_lock:
            return self.__kyc_records.get(user)

    def health_check(self) -> dict[str, Any]:
        base = super().health_check()
        base["aml_blocklist_entries"] = len(self.__blocklist)
        base["kyc_records"] = len(self.__kyc_records)
        return base

    def __sync(self) -> None:
        self._repo.save({"kyc_records": self.__kyc_records})
