from uuid import UUID

from sqlalchemy.orm import Session

from app.models.stock import (
    StockAdjustmentRequest,
    StockEntryRequest,
    StockExitRequest,
    StockMovement,
)


class StockRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def add(self, movement: StockMovement) -> None:
        self.session.add(movement)
        self.session.flush()

    def get_request(self, key: UUID) -> StockEntryRequest | None:
        return self.session.get(StockEntryRequest, key)

    def remember(self, key: UUID, fingerprint: str, response: dict) -> None:
        self.session.add(StockEntryRequest(id=key, fingerprint=fingerprint, response=response))
        self.session.flush()

    def get_exit_request(self, key: UUID) -> StockExitRequest | None:
        return self.session.get(StockExitRequest, key)

    def remember_exit(self, key: UUID, fingerprint: str, response: dict) -> None:
        self.session.add(StockExitRequest(id=key, fingerprint=fingerprint, response=response))
        self.session.flush()

    def get_adjustment_request(self, key: UUID) -> StockAdjustmentRequest | None:
        return self.session.get(StockAdjustmentRequest, key)

    def remember_adjustment(self, key: UUID, fingerprint: str, response: dict) -> None:
        self.session.add(StockAdjustmentRequest(id=key, fingerprint=fingerprint, response=response))
        self.session.flush()
