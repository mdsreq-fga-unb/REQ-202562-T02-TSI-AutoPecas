import hashlib
import json
from uuid import UUID

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, sessionmaker

from app.core.clock import store_today
from app.core.errors import DomainError
from app.models.stock import StockMovement
from app.repositories.parts import PartRepository
from app.repositories.stock import StockRepository
from app.schemas.stock import StockBalanceResponse, StockEntryCreate, StockEntryResponse


class StockService:
    def __init__(self, factory: sessionmaker[Session]) -> None:
        self.factory = factory

    def create(self, part_id: UUID, data: StockEntryCreate, key: UUID) -> StockEntryResponse:
        normalized = {**data.model_dump(mode="json"), "unit_cost": format(data.unit_cost, ".2f")}
        fingerprint = hashlib.sha256(
            (str(part_id) + json.dumps(normalized, sort_keys=True)).encode()
        ).hexdigest()
        with self.factory() as session:
            repo = StockRepository(session)
            try:
                with session.begin():
                    part = PartRepository(session).get_for_update(part_id)
                    if part is None:
                        raise DomainError("Peça não encontrada.", 404)
                    previous = self._existing(repo, key, fingerprint)
                    if previous:
                        return previous
                    if part.status == "inactive":
                        raise DomainError(
                            "Peças inativas não podem receber entradas.",
                            422,
                            fields={"part_id": "Selecione uma peça ativa."},
                        )
                    if data.entry_date > store_today():
                        raise DomainError(
                            "A data da entrada não pode ser futura.",
                            422,
                            fields={"entry_date": "Informe hoje ou uma data anterior."},
                        )
                    part.stock_balance += data.quantity
                    movement = StockMovement(part_id=part_id, **data.model_dump())
                    repo.add(movement)
                    response = StockEntryResponse(
                        id=movement.id,
                        part_id=part_id,
                        stock_balance=part.stock_balance,
                        **data.model_dump(),
                    )
                    repo.remember(key, fingerprint, response.model_dump(mode="json"))
                return response
            except IntegrityError:
                with session.begin():
                    previous = self._existing(repo, key, fingerprint)
                    if previous:
                        return previous
                raise

    def _existing(
        self,
        repo: StockRepository,
        key: UUID,
        fingerprint: str,
    ) -> StockEntryResponse | None:
        previous = repo.get_request(key)
        if previous is None:
            return None
        if previous.fingerprint != fingerprint:
            raise DomainError("Esta tentativa já foi usada com outros dados ou outra peça.", 409)
        return StockEntryResponse.model_validate(previous.response)

    def balance(self, part_id: UUID) -> StockBalanceResponse:
        with self.factory() as session:
            part = PartRepository(session).get(part_id)
            if part is None:
                raise DomainError("Peça não encontrada.", 404)
            return StockBalanceResponse(part_id=part_id, stock_balance=part.stock_balance)
