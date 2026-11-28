from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.sale import Sale, SaleCancellationRequest, SaleRequest


class SaleRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def add(self, sale: Sale) -> None:
        self.session.add(sale)
        self.session.flush()

    def get(self, sale_id: UUID) -> Sale | None:
        return self.session.get(Sale, sale_id)

    def list(self, offset: int, limit: int) -> tuple[list[Sale], int]:
        total = self.session.scalar(select(func.count()).select_from(Sale))
        sales = self.session.scalars(
            select(Sale).order_by(Sale.created_at.desc(), Sale.id).offset(offset).limit(limit)
        ).all()
        return list(sales), total

    def get_for_update(self, sale_id: UUID) -> Sale | None:
        return self.session.scalar(select(Sale).where(Sale.id == sale_id).with_for_update())

    def get_request(self, key: UUID) -> SaleRequest | None:
        return self.session.get(SaleRequest, key)

    def remember(self, key: UUID, fingerprint: str, response: dict) -> None:
        self.session.add(SaleRequest(id=key, fingerprint=fingerprint, response=response))
        self.session.flush()

    def get_cancellation_request(self, key: UUID) -> SaleCancellationRequest | None:
        return self.session.get(SaleCancellationRequest, key)

    def remember_cancellation(self, key: UUID, fingerprint: str, response: dict) -> None:
        self.session.add(
            SaleCancellationRequest(id=key, fingerprint=fingerprint, response=response)
        )
        self.session.flush()
