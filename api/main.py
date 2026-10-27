import asyncio
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from fastapi import FastAPI

from clients.ollama_client import OllamaClient
from core.config import ENABLE_DOCS, validate_runtime_config
from core.errors import register_exception_handlers
from routers.chat import router as chat_router
from routers.documents import router as documents_router
from routers.health import router as health_router

ollama_client = OllamaClient()


@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncIterator[None]:
    validate_runtime_config()
    asyncio.create_task(asyncio.to_thread(ollama_client.warm_up))
    yield


app = FastAPI(
    docs_url="/docs" if ENABLE_DOCS else None,
    redoc_url="/redoc" if ENABLE_DOCS else None,
    openapi_url="/openapi.json" if ENABLE_DOCS else None,
    lifespan=lifespan,
)

register_exception_handlers(app)
app.include_router(health_router)
app.include_router(documents_router)
app.include_router(chat_router)
