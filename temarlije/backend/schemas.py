from __future__ import annotations

from typing import List, Literal, Optional
from pydantic import BaseModel, Field


class IngestRequest(BaseModel):
    input: str = Field(..., description="Raw pasted text or a URL starting with http/https")


class IngestResponse(BaseModel):
    kind: Literal["url", "text"]
    title: Optional[str] = None
    content: str


class Flashcard(BaseModel):
    q: str
    a: str


class GenerateRequest(BaseModel):
    content: str = Field(..., description="Normalized, readable text extracted from ingestion")
    style: Literal["visual", "reading", "kinesthetic", "audio"]


class GenerateResponse(BaseModel):
    flashcards: List[Flashcard]
    summary: List[str]
    elaboration: str

