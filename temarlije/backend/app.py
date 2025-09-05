from __future__ import annotations

import os
from typing import Any, Dict

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import ValidationError

from dotenv import load_dotenv

from schemas import IngestRequest, IngestResponse, GenerateRequest, GenerateResponse
from extract import is_url, extract_readable, normalize_text_input
from ai import generate_outputs


load_dotenv()

app = FastAPI(title="TemarLije API", version="1.0.0")


origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost",
    "http://127.0.0.1",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> Dict[str, str]:
    return {"status": "ok", "name": "TemarLije"}


@app.post("/api/ingest", response_model=IngestResponse)
def post_ingest(body: IngestRequest) -> Any:
    raw = (body.input or "").strip()
    if not raw:
        raise HTTPException(status_code=400, detail="Input is empty")

    MAX_LEN = 8000

    if is_url(raw):
        try:
            title, content = extract_readable(raw)
        except Exception as e:
            # Normalize error message for frontend toast
            raise HTTPException(status_code=422, detail="Couldn’t read that page. Try another link or paste the text.") from e
        content = content[:MAX_LEN].strip()
        if not content:
            raise HTTPException(status_code=422, detail="Couldn’t read that page. Try another link or paste the text.")
        return IngestResponse(kind="url", title=title, content=content)
    else:
        content = normalize_text_input(raw)
        content = content[:MAX_LEN].strip()
        if not content:
            raise HTTPException(status_code=400, detail="Input is empty after normalization")
        return IngestResponse(kind="text", title=None, content=content)


@app.post("/api/generate", response_model=GenerateResponse)
def post_generate(body: GenerateRequest) -> Any:
    content = (body.content or "").strip()
    if not content:
        raise HTTPException(status_code=400, detail="Content is empty")
    # If content is too short, the frontend should have blocked it already; still protect here.
    if len(content) < 50:
        raise HTTPException(status_code=400, detail="Content too short to generate study pack")

    model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    try:
        result = generate_outputs(content=content, model=model)
    except RuntimeError as e:
        # Usually missing OPENAI_API_KEY or configuration
        raise HTTPException(status_code=500, detail=str(e)) from e
    except Exception as e:
        # Surface a clearer message if available
        msg = str(e) or "Upstream AI error. Please try again."
        raise HTTPException(status_code=502, detail=msg) from e

    return GenerateResponse(**result)


@app.exception_handler(ValidationError)
async def validation_exception_handler(_, exc: ValidationError):
    return JSONResponse(status_code=422, content={"detail": exc.errors()})
