from __future__ import annotations

import re
from typing import Optional, Tuple

import requests
from bs4 import BeautifulSoup
from readability import Document


URL_RE = re.compile(r"^https?://", re.IGNORECASE)


def is_url(s: str) -> bool:
    if not isinstance(s, str):
        return False
    s = s.strip()
    return bool(URL_RE.match(s))


def _normalize_whitespace(text: str) -> str:
    # Collapse newlines and spaces; keep paragraphs
    if not text:
        return ""
    # Replace \r\n with \n, collapse multiple newlines to double newline, and spaces to single
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    # Remove trailing spaces on lines
    text = "\n".join(line.strip() for line in text.split("\n"))
    # Collapse more than 2 newlines to 2
    text = re.sub(r"\n{3,}", "\n\n", text)
    # Collapse internal multiple spaces
    text = re.sub(r"[ \t]{2,}", " ", text)
    return text.strip()


def extract_readable(url: str, timeout: int = 12) -> Tuple[Optional[str], str]:
    """
    Fetch a URL and extract a readable title and main text using readability-lxml and BeautifulSoup.
    Returns (title or None, content). Raises requests.HTTPError for bad status codes.
    """
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
            "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
        )
    }
    resp = requests.get(url, headers=headers, timeout=timeout)
    resp.raise_for_status()

    html = resp.text
    doc = Document(html)
    readable_html = doc.summary(html_partial=True)
    title = doc.short_title() or None

    soup = BeautifulSoup(readable_html, "html.parser")
    # Remove scripts/styles/navs/asides that often clutter
    for tag in soup(["script", "style", "nav", "aside", "footer", "header"]):
        tag.decompose()
    text = soup.get_text("\n")
    text = _normalize_whitespace(text)

    # Fallback: If readability produced too little text, try full page text
    if len(text) < 200:
        soup_full = BeautifulSoup(html, "html.parser")
        for tag in soup_full(["script", "style", "nav", "aside", "footer", "header"]):
            tag.decompose()
        text_full = _normalize_whitespace(soup_full.get_text("\n"))
        if len(text_full) > len(text):
            text = text_full

    if not text:
        # As a last resort, use response URL and status to hint failure
        raise ValueError("Readable text could not be extracted from the page")

    return (title, text)


def normalize_text_input(text: str) -> str:
    return _normalize_whitespace(text)

