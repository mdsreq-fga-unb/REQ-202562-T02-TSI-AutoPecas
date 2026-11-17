from uuid import UUID

from sqlalchemy.orm import Session

from app.models.stock import StockEntryRequest, StockMovement


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
