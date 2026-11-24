from pydantic import BaseModel, ConfigDict, Field


class PartImportCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    filename: str = Field(min_length=1, max_length=255)
    content: str = Field(min_length=1, max_length=2_800_000)


class PartImportResponse(BaseModel):
    imported_count: int
