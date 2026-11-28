from datetime import date
from decimal import Decimal
from typing import Annotated, Literal
from uuid import UUID

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    StringConstraints,
    field_serializer,
    field_validator,
)


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


class StockExitCreate(BaseModel):
    quantity: int = Field(gt=0, strict=True)
    exit_date: date
    # strip_whitespace roda antes de min_length, então "   " vira "" e é recusado;
    # o valor aparado é o que entra no fingerprint e na persistência.
    reason: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=120)]


class StockExitResponse(StockExitCreate):
    model_config = ConfigDict(from_attributes=True)
    movement_type: Literal["exit"] = "exit"
    stock_balance: int
    id: UUID
    part_id: UUID


class StockAdjustmentCreate(BaseModel):
    quantity_delta: int = Field(strict=True)
    # strip_whitespace roda antes de min_length, então "   " vira "" e é recusado;
    # o valor aparado é o que entra no fingerprint e na persistência.
    justification: Annotated[
        str, StringConstraints(strip_whitespace=True, min_length=1, max_length=120)
    ]

    @field_validator("quantity_delta")
    @classmethod
    def reject_zero(cls, value: int) -> int:
        if value == 0:
            raise ValueError("A diferença de quantidade não pode ser zero.")
        return value


class StockAdjustmentResponse(StockAdjustmentCreate):
    model_config = ConfigDict(from_attributes=True)
    movement_type: Literal["adjustment"] = "adjustment"
    adjustment_date: date
    stock_balance: int
    id: UUID
    part_id: UUID


class StockBalanceResponse(BaseModel):
    part_id: UUID
    stock_balance: int
