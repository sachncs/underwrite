"""Loan servicing service.

Manages the post-origination lifecycle of loans: tracks active loans,
status transitions, daily interest accrual (actual/365), and coordinates
with payment, collection, and settlement services.  Also tracks Razorpay
order and mandate references against loan records.
"""

from __future__ import annotations

import threading
from datetime import datetime, timezone
from typing import Any

from underwrite.__events__ import Event, EventType
from underwrite.__logger__ import logger
from underwrite.services.base import NanoService
from underwrite.validate import get_finite


class ServicingService(NanoService):
    """Tracks active loan state, status transitions, and outstanding balances.

    Uses actual/365 daily interest accrual for accurate outstanding
    tracking. Each loan record includes:
      - ``principal``: original loan amount
      - ``outstanding``: current principal outstanding
      - ``annual_rate``: annual interest rate in percent
      - ``daily_rate``: annual_rate / 36500
      - ``last_interest_date``: last date interest was accrued to
      - ``status``: active / paid / defaulted
      - ``origin_date``: date of disbursement
      - ``razorpay_order_id``: (optional) associated Razorpay order
      - ``razorpay_mandate_status``: (optional) mandate status
    """

    def __init__(self, **kwargs: Any) -> None:
        super().__init__(**kwargs)
        self.__lock: threading.RLock = threading.RLock()

    def handle(self, event: Event) -> None:
        if event.event_type == EventType.LOAN_ORIGINATED:
            loan_id: str = event.payload.get("loan_id", "")
            borrower: str = event.payload.get("borrower", "")
            principal: float = get_finite(event.payload, "principal", 0.0)
            annual_rate: float = get_finite(event.payload, "annual_rate", 0.0)
            if not loan_id:
                logger.warning("dropping LOAN_ORIGINATED with missing loan_id")
                return
            now = datetime.now(timezone.utc)
            self.store.set(
                f"loan:{loan_id}",
                {
                    "borrower": borrower,
                    "principal": principal,
                    "outstanding": principal,
                    "annual_rate": annual_rate,
                    "daily_rate": annual_rate / 36500.0,
                    "last_interest_date": now.isoformat(),
                    "origin_date": now.isoformat(),
                    "status": "active",
                    "originated_at": now.isoformat(),
                },
            )

        elif event.event_type == EventType.REPAID:
            loan_id = event.payload.get("loan_id", "")
            if not loan_id:
                logger.warning("dropping REPAID with missing loan_id")
                return
            amount: float = get_finite(event.payload, "amount", 0.0)
            if self.bus.idempotency.is_duplicate(self.service_id,
                                                 event.event_id):
                logger.debug("duplicate REPAID event %s dropped",
                             event.event_id)
                return
            with self.__lock:
                record = self.store.get(f"loan:{loan_id}")
                if record:
                    accrued = self.__accrue_interest(record)
                    # Apply payment: first to accrued interest, then principal
                    remaining = amount
                    if accrued > 0 and remaining > 0:
                        if remaining >= accrued:
                            remaining -= accrued
                            record["accrued_interest"] = 0.0
                        else:
                            record["accrued_interest"] = accrued - remaining
                            remaining = 0.0
                    if remaining > 0:
                        record["outstanding"] = max(
                            0.0, record["outstanding"] - remaining)
                    record["last_interest_date"] = datetime.now(
                        timezone.utc).isoformat()
                    if record["outstanding"] <= 0:
                        record["status"] = "paid"
                        record["paid_at"] = datetime.now(
                            timezone.utc).isoformat()
                    self.store.set(f"loan:{loan_id}", record)

        elif event.event_type == EventType.DEFAULT_OCCURRED:
            loan_id = event.payload.get("loan_id", "")
            if not loan_id:
                logger.warning(
                    "dropping DEFAULT_OCCURRED with missing loan_id")
                return
            with self.__lock:
                record = self.store.get(f"loan:{loan_id}")
                if record:
                    record["status"] = "defaulted"
                    record["last_interest_date"] = datetime.now(
                        timezone.utc).isoformat()
                    record["defaulted_at"] = datetime.now(
                        timezone.utc).isoformat()
                    self.store.set(f"loan:{loan_id}", record)

        elif event.event_type == EventType.RAZORPAY_ORDER_CREATED:
            loan_id = event.payload.get("loan_id", "")
            order_id = event.payload.get("order_id", "")
            if not loan_id or not order_id:
                return
            with self.__lock:
                record = self.store.get(f"loan:{loan_id}")
                if record:
                    record["razorpay_order_id"] = order_id
                    self.store.set(f"loan:{loan_id}", record)

        elif event.event_type == EventType.RAZORPAY_MANDATE_ACTIVE:
            loan_id = event.payload.get("loan_id", "")
            subscription_id = event.payload.get("subscription_id", "")
            if not loan_id:
                return
            with self.__lock:
                record = self.store.get(f"loan:{loan_id}")
                if record:
                    record["razorpay_subscription_id"] = subscription_id
                    record["razorpay_mandate_status"] = "active"
                    self.store.set(f"loan:{loan_id}", record)

        elif event.event_type == EventType.RAZORPAY_MANDATE_INACTIVE:
            loan_id = event.payload.get("loan_id", "")
            if not loan_id:
                return
            with self.__lock:
                record = self.store.get(f"loan:{loan_id}")
                if record:
                    record["razorpay_mandate_status"] = "inactive"
                    self.store.set(f"loan:{loan_id}", record)

    # -- interest accrual ----------------------------------------------------

    def accrue_interest(self, loan_id: str) -> float:
        """Manually trigger interest accrual for a loan.

        Args:
            loan_id: The loan identifier.

        Returns:
            Accrued interest amount added since last accrual.
        """
        with self.__lock:
            record = self.store.get(f"loan:{loan_id}")
            if record:
                return self.__accrue_interest(record)
            return 0.0

    def __accrue_interest(self, record: dict[str, Any]) -> float:
        """Accrue interest from last_interest_date to now using actual/365.

        Updates the record in-place but does not save to store.

        Args:
            record: The loan record dict.

        Returns:
            The newly accrued interest amount.
        """
        last_str = record.get("last_interest_date", "")
        if not last_str:
            return 0.0
        try:
            last_dt = datetime.fromisoformat(str(last_str))
        except (ValueError, TypeError):
            return 0.0
        now = datetime.now(timezone.utc)
        if now <= last_dt:
            return 0.0
        days = (now - last_dt).days
        if days <= 0:
            return 0.0
        outstanding = record.get("outstanding", 0.0)
        daily_rate = record.get("daily_rate", 0.0)
        if outstanding <= 0 or daily_rate <= 0:
            return 0.0
        interest = outstanding * daily_rate * days
        current_accrued = record.get("accrued_interest", 0.0)
        record["accrued_interest"] = round(current_accrued + interest, 2)
        record["last_interest_date"] = now.isoformat()
        return round(interest, 2)
