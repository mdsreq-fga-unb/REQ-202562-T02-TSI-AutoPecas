from uuid import UUID

from sqlalchemy.orm import Session

from app.models.sale import Sale, SaleRequest


class SaleRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def add(self, sale: Sale) -> None:
        self.session.add(sale)
        self.session.flush()

    def get(self, sale_id: UUID) -> Sale | None:
        return self.session.get(Sale, sale_id)

    def get_request(self, key: UUID) -> SaleRequest | None:
        return self.session.get(SaleRequest, key)

    def remember(self, key: UUID, fingerprint: str, response: dict) -> None:
        self.session.add(SaleRequest(id=key, fingerprint=fingerprint, response=response))
        self.session.flush()
