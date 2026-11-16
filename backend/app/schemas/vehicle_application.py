from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class VehicleApplicationCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, extra="forbid")

    brand: str = Field(min_length=1, max_length=100)
    model: str = Field(min_length=1, max_length=200)
    year: str = Field(pattern=r"^[0-9]{4}$", min_length=4, max_length=4)


class VehicleApplicationResponse(VehicleApplicationCreate):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    part_id: UUID
    created_at: datetime
    updated_at: datetime


class VehicleApplicationListResponse(BaseModel):
    items: list[VehicleApplicationResponse]
    total: int
