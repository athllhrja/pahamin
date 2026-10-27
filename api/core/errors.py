import logging
import uuid
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

logger = logging.getLogger("pahamin.api")


class AppError(Exception):
    def __init__(
        self,
        status_code: int,
        code: str,
        message: str,
        retry_after: int | None = None,
    ) -> None:
        super().__init__(message)
        self.status_code: int = status_code
        self.code: str = code
        self.message: str = message
        self.retry_after: int | None = retry_after


def get_request_id(request: Request) -> str:
    header_value: str | None = request.headers.get("X-Request-ID")
    if header_value and header_value.strip():
        return header_value.strip()
    return str(uuid.uuid4())


def build_error_response(
    status_code: int,
    code: str,
    message: str,
    request_id: str,
    retry_after: int | None = None,
) -> JSONResponse:
    headers: dict[str, str] = {"X-Request-ID": request_id}
    if retry_after is not None:
        headers["Retry-After"] = str(retry_after)
    return JSONResponse(
        status_code=status_code,
        headers=headers,
        content={
            "status": "error",
            "code": code,
            "message": message,
            "request_id": request_id,
        },
    )


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(AppError)
    async def handle_app_error(request: Request, exc: AppError) -> JSONResponse:
        request_id: str = get_request_id(request)
        logger.warning(
            "app_error path=%s status=%d code=%s request_id=%s",
            request.url.path,
            exc.status_code,
            exc.code,
            request_id,
        )
        return build_error_response(
            status_code=exc.status_code,
            code=exc.code,
            message=exc.message,
            request_id=request_id,
            retry_after=exc.retry_after,
        )

    @app.exception_handler(RequestValidationError)
    async def handle_validation_error(
        request: Request,
        exc: RequestValidationError,
    ) -> JSONResponse:
        request_id: str = get_request_id(request)
        logger.warning(
            "validation_error path=%s count=%d request_id=%s",
            request.url.path,
            len(exc.errors()),
            request_id,
        )
        return build_error_response(
            status_code=422,
            code="VALIDATION_ERROR",
            message="Format permintaan tidak valid.",
            request_id=request_id,
        )

    @app.exception_handler(Exception)
    async def handle_unexpected_error(request: Request, exc: Exception) -> JSONResponse:
        request_id: str = get_request_id(request)
        logger.error(
            "internal_error path=%s error_type=%s request_id=%s",
            request.url.path,
            type(exc).__name__,
            request_id,
        )
        return build_error_response(
            status_code=500,
            code="INTERNAL_ERROR",
            message="Terjadi kesalahan pada server.",
            request_id=request_id,
        )
