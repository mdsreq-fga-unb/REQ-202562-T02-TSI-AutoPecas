from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Header, Request

from app.core.errors import DomainError
from app.schemas.sale import SaleCreate, SaleResponse
from app.services.sales import SaleService

router = APIRouter(prefix="/sales", tags=["Vendas"])


def get_sale_service(request: Request) -> SaleService:
    factory = request.app.state.session_factory
    if factory is None:
        raise DomainError("As vendas estão indisponíveis. Tente novamente mais tarde.", 503)
    return SaleService(factory)


Service = Annotated[SaleService, Depends(get_sale_service)]


@router.post("", response_model=SaleResponse, status_code=201)
def create_sale(
    data: SaleCreate,
    service: Service,
    idempotency_key: Annotated[UUID, Header()],
) -> SaleResponse:
    return service.create(data, idempotency_key)


@router.get("/{sale_id}", response_model=SaleResponse)
def get_sale(sale_id: UUID, service: Service) -> SaleResponse:
    return service.get(sale_id)
