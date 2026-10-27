from fastapi import APIRouter, Depends

from clients.ollama_client import OllamaClient
from clients.supabase_client import SupabaseClient
from core.security import AuthenticatedUser, require_chat_user
from schemas import ChatRequest, ChatResponse
from services.rag_service import RagChatService

router = APIRouter()
ollama_client = OllamaClient()


@router.post("/chat", response_model=ChatResponse)
def chat_with_document(
    payload: ChatRequest,
    user: AuthenticatedUser = Depends(require_chat_user),
) -> ChatResponse:
    supabase = SupabaseClient(access_token=user.access_token, user_id=user.user_id)
    service = RagChatService(supabase=supabase, ollama=ollama_client)
    return service.answer_question(
        document_id=payload.document_id,
        question=payload.question,
    )
