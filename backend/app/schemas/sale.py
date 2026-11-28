from datetime import datetime
from decimal import Decimal
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, Field, field_serializer

SaleChannel = Literal["counter", "mercado_livre", "direct_contact"]
SaleStatus = Literal["registered", "cancelled"]


class SaleItemCreate(BaseModel):
    part_id: UUID
    quantity: int = Field(gt=0, strict=True)
    unit_price: Decimal = Field(ge=0, decimal_places=2)


class SaleCreate(BaseModel):
    channel: SaleChannel
    items: list[SaleItemCreate] = Field(min_length=1, max_length=100)


class SaleItemResponse(SaleItemCreate):
    stock_balance: int

    @field_serializer("unit_price")
    def serialize_price(self, value: Decimal) -> str:
        return format(value, ".2f")


class SaleResponse(BaseModel):
    id: UUID
    channel: SaleChannel
    status: SaleStatus
    total: Decimal
    items: list[SaleItemResponse]

    @field_serializer("total")
    def serialize_total(self, value: Decimal) -> str:
        return format(value, ".2f")


class SaleSummaryItem(BaseModel):
    part_id: UUID
    name: str
    manufacturer_code: str
    quantity: int
    unit_price: Decimal

    @field_serializer("unit_price")
    def serialize_price(self, value: Decimal) -> str:
        return format(value, ".2f")


class SaleSummary(BaseModel):
    id: UUID
    channel: SaleChannel
    status: SaleStatus
    total: Decimal
    created_at: datetime
    items: list[SaleSummaryItem]

    @field_serializer("total")
    def serialize_total(self, value: Decimal) -> str:
        return format(value, ".2f")


class SaleListResponse(BaseModel):
    items: list[SaleSummary]
    total: int
