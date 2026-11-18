import { AppError } from "../errors";

export async function readBody(request: Request, maximum: number) {
  const declaredLength = Number(request.headers.get("content-length"));
  if (declaredLength > maximum) throw new AppError("PAYLOAD_TOO_LARGE", 413);
  if (!request.body) throw new AppError("VALIDATION_ERROR", 422);
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > maximum) {
        await reader.cancel();
        throw new AppError("PAYLOAD_TOO_LARGE", 413);
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  return bytes;
}

export async function readJson(request: Request): Promise<unknown> {
  if (request.headers.get("content-type")?.split(";")[0] !== "application/json") {
    throw new AppError("VALIDATION_ERROR", 415);
  }
  const bytes = await readBody(request, 8192);
  try {
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    throw new AppError("VALIDATION_ERROR", 422);
  }
}
