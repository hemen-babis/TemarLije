from __future__ import annotations

import json
import os
import re
from typing import Any, Dict, List

from dotenv import load_dotenv
from openai import OpenAI


load_dotenv()

SYSTEM_PROMPT = (
    "You are an expert educator. Keep facts faithful to the provided content. "
    "Do not invent facts. When uncertain, say you don’t know."
)


FLASHCARDS_USER = (
    "From the content below, create 8–10 concise study flashcards. Return ONLY a valid JSON array "
    "of objects with keys q and a. Avoid trivia, avoid duplicates, ensure coverage of key ideas. "
    "Content:\n\n{CONTENT}"
)

SUMMARY_USER = (
    "Summarize the content in 6–8 plain-English bullet points suitable for a beginner. Keep it faithful "
    "and clear. Content:\n\n{CONTENT}"
)

ELABORATION_USER = (
    "Write a 450–650 word explanation that teaches the same ideas as the content below. Use mini headings, one analogy, "
    "and one concrete example. Be structured and clear. Content:\n\n{CONTENT}"
)


def _client() -> OpenAI:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY is not set")
    return OpenAI(api_key=api_key)


def _strip_code_fences(s: str) -> str:
    if not s:
        return s
    s = s.strip()
    # Remove ```json ... ``` or ``` ... ```
    s = re.sub(r"^```[a-zA-Z]*\n", "", s)
    s = re.sub(r"\n```$", "", s)
    return s.strip()


def _chat_once(prompt: str, model: str) -> str:
    client = _client()
    resp = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
        temperature=0.2,
    )
    content = resp.choices[0].message.content or ""
    return content


def _parse_flashcards(text: str) -> List[Dict[str, str]]:
    text = _strip_code_fences(text)
    try:
        data = json.loads(text)
        if isinstance(data, list):
            cleaned = []
            for item in data:
                if not isinstance(item, dict):
                    continue
                q = str(item.get("q", "")).strip()
                a = str(item.get("a", "")).strip()
                if q and a:
                    cleaned.append({"q": q, "a": a})
            if 1 <= len(cleaned) <= 20:
                return cleaned
    except json.JSONDecodeError:
        pass
    raise ValueError("Flashcards JSON parse failed")


def _coerce_bullets(text: str) -> List[str]:
    text = _strip_code_fences(text)
    lines = [
        re.sub(r"^\s*[-*•]\s?", "", ln).strip() for ln in text.splitlines()
    ]
    bullets = [ln for ln in lines if ln]
    # In case the model returned a single paragraph, split on "; " or ". " heuristics
    if len(bullets) < 3:
        alt = re.split(r"\n\n|;\s|\.\s", text)
        alt = [a.strip(" -•*\t") for a in alt if a.strip()]
        bullets = alt if len(alt) >= len(bullets) else bullets
    # Limit to 6–8 bullets when possible
    if len(bullets) > 8:
        bullets = bullets[:8]
    return bullets


def generate_outputs(content: str, model: str | None = None) -> Dict[str, Any]:
    model = model or os.getenv("OPENAI_MODEL", "gpt-4o-mini")

    # Flashcards
    fc_prompt = FLASHCARDS_USER.format(CONTENT=content)
    fc_raw = _chat_once(fc_prompt, model)
    try:
        flashcards = _parse_flashcards(fc_raw)
    except Exception:
        # Retry with a stricter instruction
        retry_prompt = (
            fc_prompt
            + "\n\nReturn ONLY raw JSON array with objects {\"q\":...,\"a\":...}. Do not include code fences, labels, or commentary."
        )
        fc_raw_retry = _chat_once(retry_prompt, model)
        flashcards = _parse_flashcards(fc_raw_retry)

    # Summary
    sum_prompt = SUMMARY_USER.format(CONTENT=content)
    sum_raw = _chat_once(sum_prompt, model)
    summary = _coerce_bullets(sum_raw)

    # Elaboration
    el_prompt = ELABORATION_USER.format(CONTENT=content)
    el_raw = _chat_once(el_prompt, model)
    elaboration = _strip_code_fences(el_raw).strip()

    return {
        "flashcards": flashcards,
        "summary": summary,
        "elaboration": elaboration,
    }

