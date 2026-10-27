import asyncio
from dataclasses import dataclass
from datetime import datetime, timezone
import logging
from typing import Any
from uuid import UUID
import pymupdf

from clients.ollama_client import OllamaClient
from clients.supabase_client import SupabaseClient
from core.config import (
    CHUNK_OVERLAP,
    CHUNK_TOKENS,
    MAX_PAGES,
    MAX_UPLOAD_BYTES,
    MIN_EXTRACTED_CHARS,
)
from core.errors import AppError

logger = logging.getLogger("pahamin.api")
_processing_semaphore = asyncio.Semaphore(1)


@dataclass(frozen=True)
class PageText:
    halaman: int
    isi: str


@dataclass(frozen=True)
class ChunkData:
    urutan: int
    halaman: int
    isi: str


def estimate_token_count(text: str) -> int:
    return max(1, int(len(text.split()) * 1.3))


def validate_and_extract_pages(pdf_bytes: bytes) -> tuple[list[PageText], int]:
    if len(pdf_bytes) > MAX_UPLOAD_BYTES:
        raise AppError(413, "FILE_TOO_LARGE", "Ukuran berkas PDF melebihi batas 5 MB.")
    if not pdf_bytes.startswith(b"%PDF-"):
        raise AppError(400, "INVALID_PDF", "Berkas yang diunggah bukan PDF yang valid.")
    try:
        doc = pymupdf.open(stream=pdf_bytes, filetype="pdf")
    except Exception as exc:
        raise AppError(400, "INVALID_PDF", "Berkas PDF rusak dan tidak dapat dibuka.") from exc

    with doc:
        if doc.is_encrypted:
            raise AppError(400, "ENCRYPTED", "Berkas PDF terenkripsi dan tidak dapat diproses.")
        total_pages: int = doc.page_count
        if total_pages == 0:
            raise AppError(400, "EMPTY", "Berkas PDF tidak memiliki halaman.")
        limit_pages: int = min(total_pages, MAX_PAGES)
        extracted: list[PageText] = []
        total_chars: int = 0
        for page_index in range(limit_pages):
            raw_text: str = str(doc.load_page(page_index).get_text("text")).strip()
            if raw_text:
                extracted.append(PageText(halaman=page_index + 1, isi=raw_text))
                total_chars += len(raw_text)
        if total_chars < MIN_EXTRACTED_CHARS:
            raise AppError(
                400,
                "NO_TEXT",
                "Dokumen tidak memiliki teks yang cukup untuk diproses.",
            )
        return extracted, limit_pages


def split_pages_into_chunks(pages: list[PageText]) -> list[ChunkData]:
    words_per_chunk: int = max(50, int(CHUNK_TOKENS / 1.3))
    overlap_words: int = max(10, int(CHUNK_OVERLAP / 1.3))
    step: int = max(1, words_per_chunk - overlap_words)
    chunks: list[ChunkData] = []
    sequence: int = 1
    for page in pages:
        words: list[str] = page.isi.split()
        if not words:
            continue
        if len(words) <= words_per_chunk:
            chunks.append(
                ChunkData(urutan=sequence, halaman=page.halaman, isi=" ".join(words))
            )
            sequence += 1
            continue
        start: int = 0
        while start < len(words):
            segment: list[str] = words[start : start + words_per_chunk]
            chunks.append(
                ChunkData(urutan=sequence, halaman=page.halaman, isi=" ".join(segment))
            )
            sequence += 1
            if start + words_per_chunk >= len(words):
                break
            start += step
    return chunks


class DocumentProcessingService:
    def __init__(self, supabase: SupabaseClient, ollama: OllamaClient) -> None:
        self.supabase: SupabaseClient = supabase
        self.ollama: OllamaClient = ollama

    def prepare_processing(
        self,
        document_id: UUID,
    ) -> tuple[list[PageText], int]:
        doc_row: dict[str, Any] = self.supabase.get_owned_document(document_id)
        storage_path: str = str(
            doc_row.get("lokasi_file") or f"{self.supabase.user_id}/{document_id}.pdf"
        )
        pdf_bytes: bytes = self.supabase.download_pdf_bytes(storage_path)
        try:
            pages, processed_page_count = validate_and_extract_pages(pdf_bytes)
        except AppError as exc:
            self.supabase.delete_storage_file(storage_path)
            error_code: str = exc.code if exc.code != "INVALID_PDF" else "CORRUPT"
            self.supabase.update_document(
                document_id,
                {"status_proses": "FAILED", "kode_error": error_code},
            )
            if exc.status_code == 413:
                raise
            raise AppError(400, "INVALID_PDF", exc.message) from exc

        now_iso: str = datetime.now(timezone.utc).isoformat()
        self.supabase.update_document(
            document_id,
            {
                "status_proses": "PROCESSING",
                "kode_error": None,
                "jumlah_halaman": processed_page_count,
                "diproses_pada": now_iso,
            },
        )
        return pages, processed_page_count

    async def process_in_background(
        self,
        document_id: UUID,
        pages: list[PageText],
        request_id: str,
    ) -> None:
        async with _processing_semaphore:
            try:
                await asyncio.to_thread(self._embed_and_save, document_id, pages)
            except AppError as exc:
                logger.error(
                    "background_process_failed document_id=%s code=%s request_id=%s",
                    document_id,
                    exc.code,
                    request_id,
                )
                self._mark_failed_safe(document_id, exc.code)
            except Exception as exc:
                logger.error(
                    "background_process_crash document_id=%s error_type=%s request_id=%s",
                    document_id,
                    type(exc).__name__,
                    request_id,
                )
                self._mark_failed_safe(document_id, "INTERNAL_ERROR")

    def _embed_and_save(self, document_id: UUID, pages: list[PageText]) -> None:
        chunks: list[ChunkData] = split_pages_into_chunks(pages)
        embeddings: list[list[float]] = self.ollama.embed(
            [chunk.isi for chunk in chunks],
            is_query=False,
        )
        rows: list[dict[str, Any]] = [
            {
                "dokumen_id": str(document_id),
                "urutan": chunk.urutan,
                "halaman": chunk.halaman,
                "isi": chunk.isi,
                "embedding": embedding,
            }
            for chunk, embedding in zip(chunks, embeddings)
        ]
        self.supabase.replace_document_chunks(document_id, rows)
        self.supabase.update_document(
            document_id,
            {"status_proses": "READY", "kode_error": None},
        )

    def _mark_failed_safe(self, document_id: UUID, error_code: str) -> None:
        try:
            self.supabase.replace_document_chunks(document_id, [])
            self.supabase.update_document(
                document_id,
                {"status_proses": "FAILED", "kode_error": error_code},
            )
        except AppError:
            return
