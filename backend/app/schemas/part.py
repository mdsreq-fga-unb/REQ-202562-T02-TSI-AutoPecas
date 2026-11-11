from datetime import datetime
from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, StringConstraints, model_validator

Code = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=100)]


class PartCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, extra="forbid")

    manufacturer_code: Code
    name: str = Field(min_length=1, max_length=200)
    category: str = Field(min_length=1, max_length=100)
    equivalent_codes: list[Code] = Field(default_factory=list, max_length=100)
    technical_description: str | None = Field(default=None, max_length=5000)
    physical_location: str | None = Field(default=None, max_length=200)
    photo_data: str | None = Field(default=None, max_length=2_800_000)

    @model_validator(mode="after")
    def validate_distinct_codes(self) -> "PartCreate":
        codes = [self.manufacturer_code, *self.equivalent_codes]
        if len(codes) != len(set(codes)):
            raise ValueError("Não repita um código na mesma peça.")
        return self


class PartResponse(BaseModel):
    id: UUID
    manufacturer_code: str
    name: str
    category: str
    equivalent_codes: list[str]
    technical_description: str | None
    physical_location: str | None
    photo_url: str | None
    created_at: datetime
    updated_at: datetime
