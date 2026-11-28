from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Header, Request, Response

from app.core.errors import DomainError
from app.schemas.stock import (
    StockBalanceResponse,
    StockEntryCreate,
    StockEntryResponse,
    StockExitCreate,
    StockExitResponse,
)
from app.services.stock import StockService

router = APIRouter(prefix="/parts/{part_id}", tags=["Estoque"])


def get_stock_service(request: Request) -> StockService:
    factory = request.app.state.session_factory
    if factory is None:
        raise DomainError("O estoque está indisponível. Tente novamente mais tarde.", 503)
    return StockService(factory)


Service = Annotated[StockService, Depends(get_stock_service)]


@router.post("/stock-entries", response_model=StockEntryResponse, status_code=201)
def create_entry(
    part_id: UUID,
    data: StockEntryCreate,
    service: Service,
    idempotency_key: Annotated[UUID, Header()],
) -> StockEntryResponse:
    return service.create(part_id, data, idempotency_key)


@router.post("/stock-exits", response_model=StockExitResponse, status_code=201)
def create_exit(
    part_id: UUID,
    data: StockExitCreate,
    service: Service,
    idempotency_key: Annotated[UUID, Header()],
) -> StockExitResponse:
    return service.create_exit(part_id, data, idempotency_key)


@router.get("/stock-balance", response_model=StockBalanceResponse)
def get_balance(part_id: UUID, service: Service, response: Response) -> StockBalanceResponse:
    response.headers["Cache-Control"] = "no-store"
    return service.balance(part_id)
