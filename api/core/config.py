import os
from dotenv import load_dotenv

load_dotenv()

MAX_UPLOAD_BYTES: int = 5 * 1024 * 1024
MAX_PAGES: int = 20
CHUNK_TOKENS: int = 500
CHUNK_OVERLAP: int = 50
TOP_K: int = 5
SIMILARITY_THRESHOLD: float = 0.5
MIN_EXTRACTED_CHARS: int = 100
SUMMARY_DIRECT_TOKEN_LIMIT: int = 3000
MAX_DOCS_PER_USER: int = 10
MAX_QUESTION_CHARS: int = 1000
RATE_LIMIT_CHAT_PER_MIN: int = 20
RATE_LIMIT_PROCESS_PER_MIN: int = 5

EMBED_TIMEOUT_SECONDS: float = 30.0
GENERATE_TIMEOUT_SECONDS: float = 60.0
SUPABASE_TIMEOUT_SECONDS: float = 10.0

INSUFFICIENT_CONTEXT_MESSAGE: str = "Informasi tersebut tidak ditemukan dalam materi."
STORAGE_BUCKET: str = os.getenv("SUPABASE_STORAGE_BUCKET", "dokumen")

SUPABASE_URL: str = os.getenv("SUPABASE_URL", "").rstrip("/")
SUPABASE_ANON_KEY: str = os.getenv("SUPABASE_ANON_KEY", "")
OLLAMA_URL: str = os.getenv("OLLAMA_URL", "http://127.0.0.1:11434").rstrip("/")
OLLAMA_EMBED_MODEL: str = os.getenv("OLLAMA_EMBED_MODEL", "nomic-embed-text")
OLLAMA_CHAT_MODEL: str = os.getenv("OLLAMA_CHAT_MODEL", "qwen2.5:3b")
OLLAMA_KEEP_ALIVE: str = os.getenv("OLLAMA_KEEP_ALIVE", "30m")
ENABLE_DOCS: bool = os.getenv("ENABLE_DOCS", "false").lower() == "true"


def validate_runtime_config() -> None:
    if SUPABASE_URL and not SUPABASE_URL.startswith("https://"):
        raise RuntimeError("SUPABASE_URL wajib menggunakan https://")
