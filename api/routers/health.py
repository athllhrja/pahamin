from fastapi import APIRouter

from clients.ollama_client import OllamaClient
from schemas import HealthResponse

router = APIRouter()
ollama_client = OllamaClient()


@router.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    ollama_state = "up" if ollama_client.is_healthy() else "down"
    return HealthResponse(status="ok", ollama=ollama_state)
