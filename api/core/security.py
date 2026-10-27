from collections import defaultdict, deque
from dataclasses import dataclass
import math
import time
from typing import Callable
from uuid import UUID
from fastapi import Depends, Request

from clients.supabase_client import verify_supabase_token
from core.config import RATE_LIMIT_CHAT_PER_MIN, RATE_LIMIT_PROCESS_PER_MIN
from core.errors import AppError, get_request_id

WINDOW_SECONDS: float = 60.0
_rate_buckets: dict[str, deque[float]] = defaultdict(deque)


@dataclass(frozen=True)
class AuthenticatedUser:
    user_id: UUID
    access_token: str
    request_id: str


def extract_bearer_token(request: Request) -> str:
    auth_header: str = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        raise AppError(401, "AUTH_INVALID", "Sesi tidak valid atau telah berakhir.")
    token: str = auth_header.removeprefix("Bearer ").strip()
    if not token:
        raise AppError(401, "AUTH_INVALID", "Sesi tidak valid atau telah berakhir.")
    return token


def get_current_user(request: Request) -> AuthenticatedUser:
    token: str = extract_bearer_token(request)
    user_id: UUID = verify_supabase_token(token)
    request_id: str = get_request_id(request)
    return AuthenticatedUser(
        user_id=user_id,
        access_token=token,
        request_id=request_id,
    )


def enforce_rate_limit(scope: str, user_id: UUID, limit_per_minute: int) -> None:
    now: float = time.monotonic()
    bucket_key: str = f"{scope}:{user_id}"
    timestamps: deque[float] = _rate_buckets[bucket_key]
    while timestamps and now - timestamps[0] >= WINDOW_SECONDS:
        timestamps.popleft()
    if len(timestamps) >= limit_per_minute:
        retry_after: int = max(1, math.ceil(WINDOW_SECONDS - (now - timestamps[0])))
        raise AppError(
            status_code=429,
            code="RATE_LIMITED",
            message="Terlalu banyak permintaan. Silakan coba lagi sesaat lagi.",
            retry_after=retry_after,
        )
    timestamps.append(now)


def require_rate_limited_user(
    scope: str,
    limit_per_minute: int,
) -> Callable[[AuthenticatedUser], AuthenticatedUser]:
    def dependency(
        user: AuthenticatedUser = Depends(get_current_user),
    ) -> AuthenticatedUser:
        enforce_rate_limit(scope, user.user_id, limit_per_minute)
        return user

    return dependency


require_process_user = require_rate_limited_user(
    "process",
    RATE_LIMIT_PROCESS_PER_MIN,
)
require_chat_user = require_rate_limited_user(
    "chat",
    RATE_LIMIT_CHAT_PER_MIN,
)
