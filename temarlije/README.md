# TemarLije — Paste any resource. Learn your way.

TemarLije turns any pasted content (text or URL) into a focused study pack: Flashcards, a Simplified Summary, and an Elaborated Explanation. It’s a minimal, production‑grade MVP built with React + Vite + TypeScript on the frontend and FastAPI on the backend.

This repository is a monorepo containing both the frontend and backend apps.

## Features

- Flashcards: 8–10 high‑quality Q/A pairs as JSON
- Simplified Summary: 6–8 beginner‑friendly bullet points
- Elaborated Explanation: 450–650 words with headings, one analogy, and a concrete example
- Guided paste: detect URLs vs. text, with hints for short text
- Style picker: Visual (summary‑first), Reading/Writing (elaboration‑first), Kinesthetic and Audio shown as disabled (coming soon)
- Tabs with icons: Flashcards | Summary | Elaborated
- Export flashcards as JSON; copy summary to clipboard; optional downloads for Summary.md and Elaboration.md
- Non‑blocking toasts for success and errors
- Dark theme by default, glassy UI, accessible labels and focus states
- Light/dark toggle (default dark)
- Recent sessions: keeps the last 3 results in memory for quick restore

## Quick Start

Run backend and frontend in separate terminals.

### Backend

```
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # add your OPENAI key
uvicorn app:app --reload --port 8000
```

### Frontend

```
cd frontend
npm i
cp .env.example .env  # set VITE_API_BASE_URL
npm run dev
```

Open http://localhost:5173 (or the printed dev URL).

## Environment Variables

### Backend `.env`

```
OPENAI_API_KEY=sk-REPLACE_ME
OPENAI_MODEL=gpt-4o-mini
```

### Frontend `.env`

```
VITE_API_BASE_URL=http://localhost:8000
```

## API

Base path: `/api`

### POST /api/ingest

Request body:

```
{
  "input": "string"
}
```

Behavior:

- If the input matches `^https?://`, the backend fetches the page and extracts the readable content using `readability-lxml` and `beautifulsoup4`.
- Otherwise, it treats input as raw text and normalizes whitespace.
- Content is truncated to ~8000 characters.

Response:

```
{
  "kind": "url" | "text",
  "title": "string | null",
  "content": "non-empty trimmed text"
}
```

### POST /api/generate

Request body:

```
{
  "content": "string",
  "style": "visual" | "reading" | "kinesthetic" | "audio"
}
```

Behavior:

- Calls OpenAI Chat Completions three times with strict prompts (flashcards, simplified summary, elaborated explanation).
- Parses and validates outputs, retrying flashcards JSON parsing once with a stricter instruction if needed.

Response:

```
{
  "flashcards": [{"q":"...", "a":"..."}],
  "summary": ["...", "..."],
  "elaboration": "string (markdown allowed)"
}
```

Example curl:

```
curl -s http://localhost:8000/api/ingest \
  -H 'Content-Type: application/json' \
  -d '{"input":"https://example.com"}'

curl -s http://localhost:8000/api/generate \
  -H 'Content-Type: application/json' \
  -d '{"content":"Your normalized text here...","style":"visual"}'
```

## Development Notes

- CORS allows localhost origins for dev.
- URL ingestion errors return a clear message; UI remains usable.
- Short non‑URL input (< 100 chars) disables submission on the frontend with an inline hint.
- The backend strips code fences and normalizes whitespace from AI outputs.
- A lightweight history of the last 3 sessions is maintained client‑side (in memory) for convenience.

## Security and Rate Limits

- Do not expose or commit your `OPENAI_API_KEY`.
- In development, rate limits depend on your OpenAI account. Avoid rapid repeated requests by batching actions.
- The backend truncates inputs to ~8000 characters to control token usage.

## Accessibility

- All interactive elements include `aria-label`s and `title`s.
- Focus outlines are visible and keyboard navigation is supported.
- Toasts are announced using `aria-live="polite"` and include dismiss buttons.

## Screenshots

Run the app locally and navigate to the homepage to see:

- Hero header with logo and tagline
- Guided paste area with detection pill
- Style picker pills
- Output tabs with flashcards, summary, and elaborated views

## License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

MIT License. See the License section below.

### MIT License

Copyright (c) 2025 TemarLije contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
