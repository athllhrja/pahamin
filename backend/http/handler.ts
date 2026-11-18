import { ZodError } from "zod";
import { AppError, reportError } from "../errors";
import type { BackendClient } from "../types/client";

export type ClientFactory = () => Promise<BackendClient>;

export function endpoint(
  action: (request: Request, client: BackendClient) => Promise<unknown>,
  status = 200,
) {
  return async (request: Request, createClient: ClientFactory) => {
    const requestId = crypto.randomUUID();
    const headers = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
    try {
      if (!["GET", "HEAD"].includes(request.method)) {
        const origin = request.headers.get("origin");
        if (origin !== new URL(request.url).origin) throw new AppError("FORBIDDEN", 403);
      }
      const data = await action(request, await createClient());
      return Response.json({ status: "success", data, request_id: requestId }, { status, headers });
    } catch (error) {
      const safeError = reportError(error instanceof ZodError ? new AppError("VALIDATION_ERROR", 422) : error, "api");
      return Response.json({ status: "error", code: safeError.code, message: safeError.message, request_id: requestId }, { status: safeError.status, headers });
    }
  };
}
