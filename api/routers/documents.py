from uuid import UUID
from fastapi import APIRouter, BackgroundTasks, Body, Depends, status

from clients.ollama_client import OllamaClient
from clients.supabase_client import SupabaseClient
from core.security import AuthenticatedUser, get_current_user, require_process_user
from schemas import (
    ProcessDocumentRequest,
    ProcessDocumentResponse,
    SummaryRequest,
    SummaryResponse,
)
from services.pdf_service import DocumentProcessingService
from services.rag_service import SummaryService

router = APIRouter()
ollama_client = OllamaClient()


@router.post(
    "/documents/process",
    response_model=ProcessDocumentResponse,
    status_code=status.HTTP_202_ACCEPTED,
)
def process_document(
    payload: ProcessDocumentRequest,
    background_tasks: BackgroundTasks,
    user: AuthenticatedUser = Depends(require_process_user),
) -> ProcessDocumentResponse:
    supabase = SupabaseClient(access_token=user.access_token, user_id=user.user_id)
    service = DocumentProcessingService(supabase=supabase, ollama=ollama_client)
    pages, _ = service.prepare_processing(payload.document_id)
    background_tasks.add_task(
        service.process_in_background,
        payload.document_id,
        pages,
        user.request_id,
    )
    return ProcessDocumentResponse(
        document_id=payload.document_id,
        status="processing",
    )


@router.post(
    "/documents/{document_id}/summary",
    response_model=SummaryResponse,
)
def summarize_document(
    document_id: UUID,
    payload: SummaryRequest | None = Body(default=None),
    user: AuthenticatedUser = Depends(get_current_user),
) -> SummaryResponse:
    regenerate: bool = payload.regenerate if payload is not None else False
    supabase = SupabaseClient(access_token=user.access_token, user_id=user.user_id)
    service = SummaryService(supabase=supabase, ollama=ollama_client)
    return service.get_summary(document_id=document_id, regenerate=regenerate)
