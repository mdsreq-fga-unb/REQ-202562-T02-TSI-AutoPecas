from datetime import date
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, field_serializer


class StockEntryCreate(BaseModel):
    quantity: int = Field(gt=0, strict=True)
    entry_date: date
    unit_cost: Decimal = Field(ge=0, decimal_places=2)


class StockEntryResponse(StockEntryCreate):
    model_config = ConfigDict(from_attributes=True)
    stock_balance: int
    id: UUID
    part_id: UUID

    @field_serializer("unit_cost")
    def serialize_cost(self, value: Decimal) -> str:
        return format(value, ".2f")


class StockBalanceResponse(BaseModel):
    part_id: UUID
    stock_balance: int
