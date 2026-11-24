from pydantic import BaseModel, Field, field_validator


class PartSearch(BaseModel):
    code: str | None = Field(default=None, max_length=100)
    name: str | None = Field(default=None, max_length=200)
    category: str | None = Field(default=None, max_length=100)
    brand: str | None = Field(default=None, max_length=100)
    model: str | None = Field(default=None, max_length=200)
    year: str | None = Field(default=None, pattern=r"^[0-9]{4}$", min_length=4, max_length=4)
    offset: int = Field(default=0, ge=0)
    limit: int = Field(default=20, ge=1, le=100)

    @field_validator("code", "name", "category", "brand", "model", "year", mode="before")
    @classmethod
    def strip_filter(cls, value: str | None) -> str | None:
        return value.strip() or None if isinstance(value, str) else value
