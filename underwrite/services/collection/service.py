"""Collection — tracks repayment schedule and overdue accounts.

Listens for ``loan.originated`` and ``repaid`` events to maintain
an amortisation schedule and flag overdue accounts.  Uses the Indian
amortization engine (``underwrite.__amortization__``) for accurate
EMI-based schedules instead of flat principal/term division.
"""

from __future__ import annotations

from datetime import date, datetime, timezone
from decimal import Decimal
from typing import Any

from underwrite.__amortization__ import generate_schedule
from underwrite.__events__ import Event, EventType
from underwrite.services.base import StatefulService
from underwrite.services.persistence import TypedStoreRepository
from underwrite.validate import get_finite, get_non_empty

MONTHLY_INTEREST_RATE_KEY = "monthly_rate"


class CollectionService(StatefulService):
    """Tracks repayment schedules and flags overdue accounts.

    Uses the full EMI amortization schedule from
    ``underwrite.__amortization__`` for accurate repayment tracking,
    supporting both the standard EMI formula and custom EMI overrides.
    """

    def __init__(self, **kwargs: Any) -> None:
        super().__init__(**kwargs)
        self.__loans: dict[str, dict[str, Any]] = {}
        self._repo: TypedStoreRepository[dict[str,
                                              dict[str,
                                                   Any]]] = self.store_repo(
                                                       "loans", dict)
        loaded = self._repo.load(default={})
        if loaded:
            self.__loans = loaded

    def handle(self, event: Event) -> None:
        if event.event_type == EventType.LOAN_ORIGINATED:
            p = event.payload
            borrower: str = get_non_empty(p, "borrower")
            principal: float = get_finite(p, "principal", 0.0)
            term: int = int(get_finite(p, "term", 1.0))
            annual_rate: float = get_finite(p, "annual_rate", 0.0)
            start_date_str: str = p.get("start_date", "")

            with self.state_lock:
                if annual_rate > 0:
                    sched = self.__build_schedule(principal, annual_rate, term,
                                                  start_date_str)
                    monthly = float(sched.emi)
                else:
                    monthly = principal / term if term > 0 else 0.0
                self.__loans[borrower] = {
                    "principal": principal,
                    "term": term,
                    "annual_rate": annual_rate,
                    "monthly": monthly,
                    "paid": 0.0,
                    "status": "active",
                    "created_at": datetime.now(timezone.utc).isoformat(),
                }
                if annual_rate > 0:
                    self.__loans[borrower]["schedule"] = sched.to_dict()
                self.__sync()
            self.emit(
                EventType.COLLECTION_UPDATED,
                {
                    "borrower": borrower,
                    "monthly": monthly,
                    "total": principal,
                    "status": "active",
                },
                correlation_id=event.correlation_id,
            )
        elif event.event_type == EventType.REPAID:
            p = event.payload
            user: str = get_non_empty(p, "user")
            delta: float = get_finite(p, "delta_earned")
            emit_data: dict[str, Any] | None = None
            with self.state_lock:
                loan = self.__loans.get(user)
                if loan:
                    loan["paid"] += delta
                    if loan["paid"] >= loan["principal"]:
                        loan["status"] = "closed"
                    self.__sync()
                    emit_data = {
                        "borrower": user,
                        "paid": round(loan["paid"], 2),
                        "remaining": round(loan["principal"] - loan["paid"],
                                           2),
                        "status": loan["status"],
                    }
            if emit_data is not None:
                self.emit(EventType.COLLECTION_UPDATED,
                          emit_data,
                          correlation_id=event.correlation_id)

    def get(self, borrower: str) -> dict[str, Any] | None:
        """Retrieve the collection record for a borrower.

        Args:
            borrower: The borrower identifier.

        Returns:
            Collection record dict or None if not found.
        """
        with self.state_lock:
            return self.__loans.get(borrower)

    # -- schedule helper -----------------------------------------------------

    def __build_schedule(
        self,
        principal: float,
        annual_rate: float,
        term: int,
        start_date_str: str = "",
    ) -> Any:
        """Build an amortisation schedule for the loan.

        Args:
            principal: Loan principal.
            annual_rate: Annual interest rate in percent.
            term: Loan tenure in months.
            start_date_str: Optional ISO start date string.

        Returns:
            An AmortizationSchedule instance.
        """
        sd: date | None = None
        if start_date_str:
            try:
                sd = date.fromisoformat(start_date_str)
            except (ValueError, TypeError):
                sd = None
        return generate_schedule(
            Decimal(str(principal)),
            Decimal(str(annual_rate)),
            term,
            start_date=sd,
        )

    # -- state persistence ---------------------------------------------------

    def __sync(self) -> None:
        """Persist the in-memory loans to the shared store."""
        self._repo.save(self.__loans)
