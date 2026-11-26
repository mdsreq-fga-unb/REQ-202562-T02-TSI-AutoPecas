import hashlib
import json
from collections import Counter
from decimal import Decimal
from uuid import UUID

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, sessionmaker

from app.core.errors import DomainError
from app.models.part import Part
from app.models.sale import Sale, SaleItem
from app.repositories.parts import PartRepository
from app.repositories.sales import SaleRepository
from app.schemas.sale import SaleCreate, SaleItemResponse, SaleResponse


class SaleService:
    def __init__(self, factory: sessionmaker[Session]) -> None:
        self.factory = factory

    def create(self, data: SaleCreate, key: UUID) -> SaleResponse:
        normalized = {
            "channel": data.channel,
            "items": [
                {
                    "part_id": str(entry.part_id),
                    "quantity": entry.quantity,
                    "unit_price": format(entry.unit_price, ".2f"),
                }
                for entry in data.items
            ],
        }
        fingerprint = hashlib.sha256(json.dumps(normalized, sort_keys=True).encode()).hexdigest()
        with self.factory() as session:
            repo = SaleRepository(session)
            try:
                with session.begin():
                    previous = self._existing(repo, key, fingerprint)
                    if previous:
                        return previous
                    parts = self._lock_parts(session, data)
                    requested = Counter[UUID]()
                    for entry in data.items:
                        requested[entry.part_id] += entry.quantity
                    self._check_balances(data, parts, requested)
                    for part_id, quantity in requested.items():
                        parts[part_id].stock_balance -= quantity
                    sale = Sale(
                        channel=data.channel,
                        items=[
                            SaleItem(
                                part_id=entry.part_id,
                                position=position,
                                quantity=entry.quantity,
                                unit_price=entry.unit_price,
                            )
                            for position, entry in enumerate(data.items)
                        ],
                    )
                    repo.add(sale)
                    response = self._response(sale, parts)
                    repo.remember(key, fingerprint, response.model_dump(mode="json"))
                return response
            except IntegrityError:
                with session.begin():
                    previous = self._existing(repo, key, fingerprint)
                    if previous:
                        return previous
                raise

    def get(self, sale_id: UUID) -> SaleResponse:
        with self.factory() as session:
            sale = SaleRepository(session).get(sale_id)
            if sale is None:
                raise DomainError("Venda não encontrada.", 404)
            parts = {}
            part_repo = PartRepository(session)
            for entry in sale.items:
                parts[entry.part_id] = part_repo.get(entry.part_id)
            return self._response(sale, parts)

    def _lock_parts(self, session: Session, data: SaleCreate) -> dict[UUID, Part]:
        repo = PartRepository(session)
        parts: dict[UUID, Part] = {}
        for part_id in sorted({entry.part_id for entry in data.items}, key=str):
            part = repo.get_for_update(part_id)
            if part is None:
                raise DomainError(
                    "Uma das peças da venda não foi encontrada.",
                    422,
                    fields={"items": "Selecione peças cadastradas."},
                )
            if part.status == "inactive":
                raise DomainError(
                    "Peças inativas não podem ser vendidas.",
                    422,
                    fields={"items": "Remova as peças inativas da venda."},
                )
            parts[part_id] = part
        return parts

    def _check_balances(
        self,
        data: SaleCreate,
        parts: dict[UUID, Part],
        requested: Counter[UUID],
    ) -> None:
        short = []
        for part_id in dict.fromkeys(entry.part_id for entry in data.items):
            if requested[part_id] > parts[part_id].stock_balance:
                short.append(
                    {
                        "part_id": str(part_id),
                        "requested": requested[part_id],
                        "stock_balance": parts[part_id].stock_balance,
                    }
                )
        if short:
            raise DomainError(
                "Saldo insuficiente: a quantidade vendida não pode superar o saldo atual.",
                422,
                items=short,
            )

    def _response(self, sale: Sale, parts: dict[UUID, Part]) -> SaleResponse:
        total = sum((entry.quantity * entry.unit_price for entry in sale.items), Decimal("0"))
        return SaleResponse(
            id=sale.id,
            channel=sale.channel,
            status=sale.status,
            total=total,
            items=[
                SaleItemResponse(
                    part_id=entry.part_id,
                    quantity=entry.quantity,
                    unit_price=entry.unit_price,
                    stock_balance=parts[entry.part_id].stock_balance,
                )
                for entry in sale.items
            ],
        )

    def _existing(self, repo: SaleRepository, key: UUID, fingerprint: str) -> SaleResponse | None:
        previous = repo.get_request(key)
        if previous is None:
            return None
        if previous.fingerprint != fingerprint:
            raise DomainError("Esta tentativa já foi usada com outros dados.", 409)
        return SaleResponse.model_validate(previous.response)
