import hashlib
import json
from collections.abc import Callable
from uuid import UUID

from pydantic import BaseModel
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, sessionmaker

from app.core.clock import store_today
from app.core.errors import DomainError
from app.models.stock import (
    StockAdjustmentRequest,
    StockEntryRequest,
    StockExitRequest,
    StockMovement,
)
from app.repositories.parts import PartRepository
from app.repositories.stock import StockRepository
from app.schemas.stock import (
    StockAdjustmentCreate,
    StockAdjustmentResponse,
    StockBalanceResponse,
    StockEntryCreate,
    StockEntryResponse,
    StockExitCreate,
    StockExitResponse,
)


class StockService:
    def __init__(self, factory: sessionmaker[Session]) -> None:
        self.factory = factory

    @staticmethod
    def _fingerprint(part_id: UUID, normalized: dict) -> str:
        return hashlib.sha256(
            (str(part_id) + json.dumps(normalized, sort_keys=True)).encode()
        ).hexdigest()

    def _remembered[T: BaseModel](
        self,
        getter: Callable[
            [UUID], StockEntryRequest | StockExitRequest | StockAdjustmentRequest | None
        ],
        key: UUID,
        fingerprint: str,
        schema: type[T],
    ) -> T | None:
        previous = getter(key)
        if previous is None:
            return None
        if previous.fingerprint != fingerprint:
            raise DomainError("Esta tentativa já foi usada com outros dados ou outra peça.", 409)
        return schema.model_validate(previous.response)

    def create(self, part_id: UUID, data: StockEntryCreate, key: UUID) -> StockEntryResponse:
        normalized = {**data.model_dump(mode="json"), "unit_cost": format(data.unit_cost, ".2f")}
        fingerprint = self._fingerprint(part_id, normalized)
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

    def create_exit(self, part_id: UUID, data: StockExitCreate, key: UUID) -> StockExitResponse:
        fingerprint = self._fingerprint(part_id, data.model_dump(mode="json"))
        with self.factory() as session:
            repo = StockRepository(session)
            try:
                with session.begin():
                    part = PartRepository(session).get_for_update(part_id)
                    if part is None:
                        raise DomainError("Peça não encontrada.", 404)
                    previous = self._existing_exit(repo, key, fingerprint)
                    if previous:
                        return previous
                    if part.status == "inactive":
                        raise DomainError(
                            "Peças inativas não podem receber saídas.",
                            422,
                            fields={"part_id": "Selecione uma peça ativa."},
                        )
                    if data.exit_date > store_today():
                        raise DomainError(
                            "A data da saída não pode ser futura.",
                            422,
                            fields={"exit_date": "Informe hoje ou uma data anterior."},
                        )
                    if data.quantity > part.stock_balance:
                        raise DomainError(
                            f"Saldo insuficiente: há {part.stock_balance} unidades disponíveis.",
                            422,
                            fields={
                                "quantity": "Informe no máximo o saldo disponível.",
                            },
                            stock_balance=part.stock_balance,
                        )
                    part.stock_balance -= data.quantity
                    movement = StockMovement(
                        part_id=part_id,
                        movement_type="exit",
                        quantity=data.quantity,
                        entry_date=data.exit_date,
                        reason=data.reason,
                    )
                    repo.add(movement)
                    response = StockExitResponse(
                        id=movement.id,
                        part_id=part_id,
                        stock_balance=part.stock_balance,
                        **data.model_dump(),
                    )
                    repo.remember_exit(key, fingerprint, response.model_dump(mode="json"))
                return response
            except IntegrityError:
                with session.begin():
                    previous = self._existing_exit(repo, key, fingerprint)
                    if previous:
                        return previous
                raise

    def create_adjustment(
        self, part_id: UUID, data: StockAdjustmentCreate, key: UUID
    ) -> StockAdjustmentResponse:
        fingerprint = self._fingerprint(part_id, data.model_dump(mode="json"))
        with self.factory() as session:
            repo = StockRepository(session)
            try:
                with session.begin():
                    part = PartRepository(session).get_for_update(part_id)
                    if part is None:
                        raise DomainError("Peça não encontrada.", 404)
                    previous = self._existing_adjustment(repo, key, fingerprint)
                    if previous:
                        return previous
                    if part.status == "inactive":
                        raise DomainError(
                            "Peças inativas não podem receber ajustes de inventário.",
                            422,
                            fields={"part_id": "Selecione uma peça ativa."},
                        )
                    new_balance = part.stock_balance + data.quantity_delta
                    if new_balance < 0:
                        raise DomainError(
                            f"Ajuste resultaria em saldo negativo: há {part.stock_balance}"
                            " unidades disponíveis.",
                            422,
                            fields={
                                "quantity_delta": (
                                    "Informe uma diferença que não deixe o saldo negativo."
                                ),
                            },
                            stock_balance=part.stock_balance,
                        )
                    adjustment_date = store_today()
                    part.stock_balance = new_balance
                    movement = StockMovement(
                        part_id=part_id,
                        movement_type="adjustment",
                        quantity=data.quantity_delta,
                        entry_date=adjustment_date,
                        reason=data.justification,
                    )
                    repo.add(movement)
                    response = StockAdjustmentResponse(
                        id=movement.id,
                        part_id=part_id,
                        adjustment_date=adjustment_date,
                        stock_balance=part.stock_balance,
                        **data.model_dump(),
                    )
                    repo.remember_adjustment(key, fingerprint, response.model_dump(mode="json"))
                return response
            except IntegrityError:
                with session.begin():
                    previous = self._existing_adjustment(repo, key, fingerprint)
                    if previous:
                        return previous
                raise

    def _existing_adjustment(
        self,
        repo: StockRepository,
        key: UUID,
        fingerprint: str,
    ) -> StockAdjustmentResponse | None:
        return self._remembered(
            repo.get_adjustment_request, key, fingerprint, StockAdjustmentResponse
        )

    def _existing_exit(
        self,
        repo: StockRepository,
        key: UUID,
        fingerprint: str,
    ) -> StockExitResponse | None:
        return self._remembered(repo.get_exit_request, key, fingerprint, StockExitResponse)

    def _existing(
        self,
        repo: StockRepository,
        key: UUID,
        fingerprint: str,
    ) -> StockEntryResponse | None:
        return self._remembered(repo.get_request, key, fingerprint, StockEntryResponse)

    def balance(self, part_id: UUID) -> StockBalanceResponse:
        with self.factory() as session:
            part = PartRepository(session).get(part_id)
            if part is None:
                raise DomainError("Peça não encontrada.", 404)
            return StockBalanceResponse(part_id=part_id, stock_balance=part.stock_balance)
