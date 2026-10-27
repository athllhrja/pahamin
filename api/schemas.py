from typing import Literal
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field, field_validator
from core.config import MAX_QUESTION_CHARS


class StrictModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


class HealthResponse(StrictModel):
    status: Literal["ok"]
    ollama: Literal["up", "down"]


class ProcessDocumentRequest(StrictModel):
    document_id: UUID


class ProcessDocumentResponse(StrictModel):
    document_id: UUID
    status: Literal["processing"]


class SummaryRequest(StrictModel):
    regenerate: bool = False


class SummaryPayload(StrictModel):
    summary: str = Field(min_length=1)
    key_points: list[str] = Field(min_length=1)


class SummaryResponse(StrictModel):
    status: Literal["success"]
    summary: str
    key_points: list[str]
    generated_at: str
    cached: bool


class ChatRequest(StrictModel):
    document_id: UUID
    question: str = Field(min_length=1, max_length=MAX_QUESTION_CHARS)

    @field_validator("question")
    @classmethod
    def validate_non_blank(cls, value: str) -> str:
        trimmed: str = value.strip()
        if not trimmed:
            raise ValueError("Pertanyaan tidak boleh kosong.")
        return trimmed


class SourceItem(StrictModel):
    potongan_id: UUID
    halaman: int


class ChatResponse(StrictModel):
    status: Literal["success", "insufficient_context"]
    answer: str
    sources: list[SourceItem]
