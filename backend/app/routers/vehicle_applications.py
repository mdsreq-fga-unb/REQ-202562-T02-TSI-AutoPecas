from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Header, Query, Request

from app.core.errors import DomainError
from app.schemas.vehicle_application import (
    VehicleApplicationCreate,
    VehicleApplicationListResponse,
    VehicleApplicationResponse,
)
from app.services.vehicle_applications import VehicleApplicationService

router = APIRouter(prefix="/parts/{part_id}/vehicle-applications", tags=["Aplicações por veículo"])


def get_application_service(request: Request) -> VehicleApplicationService:
    factory = request.app.state.session_factory
    if factory is None:
        raise DomainError("As aplicações estão indisponíveis. Tente novamente mais tarde.", 503)
    return VehicleApplicationService(factory)


Service = Annotated[VehicleApplicationService, Depends(get_application_service)]


@router.post("", response_model=VehicleApplicationResponse, status_code=201)
def create_application(
    part_id: UUID,
    data: VehicleApplicationCreate,
    service: Service,
    idempotency_key: Annotated[UUID, Header()],
) -> VehicleApplicationResponse:
    return service.create(part_id, data, idempotency_key)


@router.get("", response_model=VehicleApplicationListResponse)
def list_applications(
    part_id: UUID,
    service: Service,
    offset: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
) -> VehicleApplicationListResponse:
    return service.list(part_id, offset, limit)
