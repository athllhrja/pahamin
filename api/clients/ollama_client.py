import json
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.request import Request as UrlRequest, urlopen

from core.config import (
    EMBED_TIMEOUT_SECONDS,
    GENERATE_TIMEOUT_SECONDS,
    OLLAMA_CHAT_MODEL,
    OLLAMA_EMBED_MODEL,
    OLLAMA_KEEP_ALIVE,
    OLLAMA_URL,
)
from core.errors import AppError


def _post_ollama(path: str, payload: dict[str, Any], timeout: float) -> dict[str, Any]:
    body: bytes = json.dumps(payload).encode("utf-8")
    req = UrlRequest(
        url=f"{OLLAMA_URL}{path}",
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urlopen(req, timeout=timeout) as resp:
            raw: bytes = resp.read()
            parsed: Any = json.loads(raw.decode("utf-8"))
            if isinstance(parsed, dict):
                return parsed
            raise AppError(503, "UPSTREAM_UNAVAILABLE", "Respons layanan AI tidak valid.")
    except (HTTPError, URLError, TimeoutError, OSError) as exc:
        raise AppError(
            503,
            "UPSTREAM_UNAVAILABLE",
            "Layanan AI lokal sedang tidak tersedia.",
        ) from exc


class OllamaClient:
    def is_healthy(self) -> bool:
        req = UrlRequest(url=f"{OLLAMA_URL}/api/tags", method="GET")
        try:
            with urlopen(req, timeout=3.0) as resp:
                return int(resp.status) == 200
        except (HTTPError, URLError, TimeoutError, OSError):
            return False

    def warm_up(self) -> None:
        try:
            _post_ollama(
                "/api/generate",
                {
                    "model": OLLAMA_CHAT_MODEL,
                    "prompt": "",
                    "keep_alive": OLLAMA_KEEP_ALIVE,
                },
                timeout=5.0,
            )
        except AppError:
            return

    def embed(self, texts: list[str], is_query: bool) -> list[list[float]]:
        prefix: str = "search_query: " if is_query else "search_document: "
        prefixed_inputs: list[str] = [f"{prefix}{text}" for text in texts]
        result: dict[str, Any] = _post_ollama(
            "/api/embed",
            {
                "model": OLLAMA_EMBED_MODEL,
                "input": prefixed_inputs,
                "keep_alive": OLLAMA_KEEP_ALIVE,
            },
            timeout=EMBED_TIMEOUT_SECONDS,
        )
        embeddings: Any = result.get("embeddings")
        if not isinstance(embeddings, list) or len(embeddings) != len(texts):
            raise AppError(503, "UPSTREAM_UNAVAILABLE", "Gagal membuat vektor embedding.")
        return [[float(val) for val in vec] for vec in embeddings]

    def generate(
        self,
        system_prompt: str,
        user_prompt: str,
        json_format: bool = False,
    ) -> str:
        payload: dict[str, Any] = {
            "model": OLLAMA_CHAT_MODEL,
            "system": system_prompt,
            "prompt": user_prompt,
            "stream": False,
            "keep_alive": OLLAMA_KEEP_ALIVE,
            "options": {
                "temperature": 0.2,
                "num_ctx": 4096,
            },
        }
        if json_format:
            payload["format"] = "json"
        result: dict[str, Any] = _post_ollama(
            "/api/generate",
            payload,
            timeout=GENERATE_TIMEOUT_SECONDS,
        )
        response_text: Any = result.get("response")
        if not isinstance(response_text, str) or not response_text.strip():
            raise AppError(503, "UPSTREAM_UNAVAILABLE", "Layanan AI tidak menghasilkan respons.")
        return response_text.strip()
