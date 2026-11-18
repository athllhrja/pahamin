import { endpoint } from "../http/handler";
import { readBody } from "../http/body";
import { MAX_UPLOAD_BYTES } from "../config";
import { AppError } from "../errors";
import { uploadSchema } from "../schemas";
import { listDocuments, uploadDocument } from "../services/documents";
import { requireUser } from "../supabase/session";

export const listDocumentsHandler = endpoint(async (_request, client) => listDocuments(client));

export const uploadDocumentHandler = endpoint(async (request, client) => {
  await requireUser(client);
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.startsWith("multipart/form-data;")) throw new AppError("INVALID_PDF", 415);
  const bytes = await readBody(request, MAX_UPLOAD_BYTES + 65536);
  let form: FormData;
  try {
    form = await new Response(bytes, { headers: { "Content-Type": contentType } }).formData();
  } catch {
    throw new AppError("INVALID_PDF", 422);
  }
  if ([...form.keys()].length !== 1) throw new AppError("INVALID_PDF", 422);
  const { file } = uploadSchema.parse({ file: form.get("file") });
  return uploadDocument(client, file);
}, 201);
