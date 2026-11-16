from datetime import UTC, datetime
from typing import Annotated, Literal
from uuid import UUID

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    StringConstraints,
    field_validator,
    model_validator,
)

Code = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=100)]
PartStatus = Literal["active", "inactive"]


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
    # Respostas idempotentes gravadas antes da US06 representam peças inicialmente ativas.
    status: PartStatus = "active"

    @field_validator("created_at", "updated_at")
    @classmethod
    def normalize_utc(cls, value: datetime) -> datetime:
        # SQLite devolve datas sem fuso; os valores persistidos pelo serviço são UTC.
        return value.replace(tzinfo=UTC) if value.tzinfo is None else value.astimezone(UTC)


class PartUpdate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, extra="forbid")

    name: str | None = Field(default=None, min_length=1, max_length=200)
    category: str | None = Field(default=None, min_length=1, max_length=100)
    equivalent_codes: list[Code] | None = Field(default=None, max_length=100)
    technical_description: str | None = Field(default=None, max_length=5000)
    physical_location: str | None = Field(default=None, max_length=200)
    photo_data: str | None = Field(default=None, max_length=2_800_000)
    status: PartStatus | None = None

    @model_validator(mode="after")
    def validate_update(self) -> "PartUpdate":
        if not self.model_fields_set:
            raise ValueError("Informe ao menos um campo para editar.")
        for field in ("name", "category", "equivalent_codes", "status"):
            if field in self.model_fields_set and getattr(self, field) is None:
                raise ValueError(
                    "Nome, categoria, lista de equivalentes e status não podem ser nulos."
                )
        if self.equivalent_codes is not None and len(self.equivalent_codes) != len(
            set(self.equivalent_codes)
        ):
            raise ValueError("Não repita um código na mesma peça.")
        return self


class PartListResponse(BaseModel):
    items: list[PartResponse]
    total: int
