import json
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import quote
from urllib.request import Request as UrlRequest, urlopen
from uuid import UUID

from core.config import STORAGE_BUCKET, SUPABASE_ANON_KEY, SUPABASE_TIMEOUT_SECONDS, SUPABASE_URL
from core.errors import AppError


def _require_supabase_config() -> None:
    if not SUPABASE_URL or not SUPABASE_ANON_KEY:
        raise AppError(503, "UPSTREAM_UNAVAILABLE", "Konfigurasi database belum tersedia.")


def _build_headers(
    access_token: str,
    extra: dict[str, str] | None = None,
) -> dict[str, str]:
    headers: dict[str, str] = {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
    }
    if extra:
        headers.update(extra)
    return headers


def _request_json(
    method: str,
    path: str,
    access_token: str,
    body: Any = None,
    extra_headers: dict[str, str] | None = None,
    retry_on_failure: bool = False,
) -> Any:
    _require_supabase_config()
    data: bytes | None = json.dumps(body).encode("utf-8") if body is not None else None
    req = UrlRequest(
        url=f"{SUPABASE_URL}{path}",
        data=data,
        headers=_build_headers(access_token, extra_headers),
        method=method,
    )
    attempts: int = 2 if retry_on_failure else 1
    for attempt in range(attempts):
        try:
            with urlopen(req, timeout=SUPABASE_TIMEOUT_SECONDS) as resp:
                raw: bytes = resp.read()
                return json.loads(raw.decode("utf-8")) if raw else None
        except HTTPError as exc:
            if exc.code in (401, 403):
                raise AppError(401, "AUTH_INVALID", "Sesi tidak valid atau telah berakhir.") from exc
            if attempt + 1 < attempts and exc.code >= 500:
                continue
            raise AppError(503, "UPSTREAM_UNAVAILABLE", "Layanan data sedang tidak tersedia.") from exc
        except (URLError, TimeoutError, OSError) as exc:
            if attempt + 1 < attempts:
                continue
            raise AppError(503, "UPSTREAM_UNAVAILABLE", "Layanan data sedang tidak tersedia.") from exc
    return None


def verify_supabase_token(access_token: str) -> UUID:
    payload: Any = _request_json("GET", "/auth/v1/user", access_token)
    if isinstance(payload, dict) and isinstance(payload.get("id"), str):
        try:
            return UUID(payload["id"])
        except ValueError as exc:
            raise AppError(401, "AUTH_INVALID", "Sesi tidak valid atau telah berakhir.") from exc
    raise AppError(401, "AUTH_INVALID", "Sesi tidak valid atau telah berakhir.")


class SupabaseClient:
    def __init__(self, access_token: str, user_id: UUID) -> None:
        self.access_token: str = access_token
        self.user_id: UUID = user_id

    def get_owned_document(self, document_id: UUID) -> dict[str, Any]:
        doc_filter: str = quote(str(document_id), safe="")
        rows: Any = _request_json(
            "GET",
            f"/rest/v1/dokumen?dokumen_id=eq.{doc_filter}&select=*",
            self.access_token,
            retry_on_failure=True,
        )
        if not isinstance(rows, list) or not rows or not isinstance(rows[0], dict):
            raise AppError(404, "NOT_FOUND", "Dokumen tidak ditemukan.")
        row: dict[str, Any] = rows[0]
        if str(row.get("user_id")) != str(self.user_id):
            raise AppError(404, "NOT_FOUND", "Dokumen tidak ditemukan.")
        return row

    def update_document(self, document_id: UUID, fields: dict[str, Any]) -> None:
        doc_filter: str = quote(str(document_id), safe="")
        _request_json(
            "PATCH",
            f"/rest/v1/dokumen?dokumen_id=eq.{doc_filter}",
            self.access_token,
            body=fields,
            extra_headers={"Prefer": "return=minimal"},
        )

    def download_pdf_bytes(self, storage_path: str) -> bytes:
        _require_supabase_config()
        normalized: str = storage_path.lstrip("/")
        req = UrlRequest(
            url=f"{SUPABASE_URL}/storage/v1/object/authenticated/{STORAGE_BUCKET}/{normalized}",
            headers={"apikey": SUPABASE_ANON_KEY, "Authorization": f"Bearer {self.access_token}"},
            method="GET",
        )
        try:
            with urlopen(req, timeout=SUPABASE_TIMEOUT_SECONDS) as resp:
                return resp.read()
        except HTTPError as exc:
            if exc.code in (400, 404):
                raise AppError(404, "NOT_FOUND", "Berkas dokumen tidak ditemukan.") from exc
            raise AppError(503, "UPSTREAM_UNAVAILABLE", "Gagal mengunduh berkas.") from exc
        except (URLError, TimeoutError, OSError) as exc:
            raise AppError(503, "UPSTREAM_UNAVAILABLE", "Gagal mengunduh berkas.") from exc

    def delete_storage_file(self, storage_path: str) -> None:
        try:
            _request_json(
                "DELETE",
                f"/storage/v1/object/{STORAGE_BUCKET}",
                self.access_token,
                body={"prefixes": [storage_path.lstrip("/")]},
            )
        except AppError:
            return

    def replace_document_chunks(self, document_id: UUID, chunks: list[dict[str, Any]]) -> None:
        doc_filter: str = quote(str(document_id), safe="")
        _request_json(
            "DELETE",
            f"/rest/v1/potongan_dokumen?dokumen_id=eq.{doc_filter}",
            self.access_token,
            extra_headers={"Prefer": "return=minimal"},
        )
        if chunks:
            _request_json(
                "POST",
                "/rest/v1/potongan_dokumen",
                self.access_token,
                body=chunks,
                extra_headers={"Prefer": "return=minimal"},
            )

    def list_document_chunks(self, document_id: UUID) -> list[dict[str, Any]]:
        doc_filter: str = quote(str(document_id), safe="")
        rows: Any = _request_json(
            "GET",
            f"/rest/v1/potongan_dokumen?dokumen_id=eq.{doc_filter}&select=potongan_id,urutan,halaman,isi&order=urutan.asc",
            self.access_token,
            retry_on_failure=True,
        )
        return [r for r in rows if isinstance(r, dict)] if isinstance(rows, list) else []

    def search_similar_chunks(
        self,
        document_id: UUID,
        query_embedding: list[float],
        limit: int,
    ) -> list[dict[str, Any]]:
        rows: Any = _request_json(
            "POST",
            "/rest/v1/rpc/cari_potongan",
            self.access_token,
            body={"p_dokumen_id": str(document_id), "p_embedding": query_embedding, "p_limit": limit},
            retry_on_failure=True,
        )
        return [r for r in rows if isinstance(r, dict)] if isinstance(rows, list) else []

    def next_chat_sequence(self, document_id: UUID) -> int:
        doc_filter: str = quote(str(document_id), safe="")
        rows: Any = _request_json(
            "GET",
            f"/rest/v1/pesan_chat?dokumen_id=eq.{doc_filter}&select=urutan&order=urutan.desc&limit=1",
            self.access_token,
            retry_on_failure=True,
        )
        if isinstance(rows, list) and rows and isinstance(rows[0], dict):
            return int(rows[0].get("urutan", 0)) + 1
        return 1

    def insert_chat_messages(self, messages: list[dict[str, Any]]) -> None:
        _request_json(
            "POST",
            "/rest/v1/pesan_chat",
            self.access_token,
            body=messages,
            extra_headers={"Prefer": "return=minimal"},
        )
