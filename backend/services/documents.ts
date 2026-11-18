import type { BackendClient } from "../types/client";
import { validatePdf } from "../validation/pdf";
import { requireUser } from "../supabase/session";
import { DOCUMENT_BUCKET } from "../config";
import { AppError, asAppError } from "../errors";
import { uploadSchema } from "../schemas";
import { runUpload } from "./upload-workflow";

export async function listDocuments(client: BackendClient) {
  const user = await requireUser(client);
  const { data, error } = await client.from("dokumen")
    .select("dokumen_id,user_id,nama_file,lokasi_file,ukuran_file,status_proses,dibuat_pada,diunggah_pada")
    .eq("user_id", user.id).order("dibuat_pada", { ascending: false });
  if (error) throw asAppError(error);
  return data;
}

export async function uploadDocument(client: BackendClient, file: File) {
  const parsed = uploadSchema.safeParse({ file });
  if (!parsed.success) throw new AppError("INVALID_PDF", 422);
  const user = await requireUser(client);
  await validatePdf(file);
  const documentId = crypto.randomUUID();
  const path = `${user.id}/${documentId}.pdf`;
  try {
    return await runUpload({
      reserve: async () => {
        const { data, error } = await client.from("dokumen").insert({
          dokumen_id: documentId,
          user_id: user.id,
          nama_file: file.name,
          lokasi_file: path,
          ukuran_file: file.size,
        }).select("dokumen_id,user_id,nama_file,lokasi_file,ukuran_file,status_proses,dibuat_pada,diunggah_pada").single();
        if (error) throw asAppError(error);
        return data;
      },
      upload: async () => {
        const { error } = await client.storage.from(DOCUMENT_BUCKET)
          .upload(path, file, { contentType: "application/pdf", upsert: false });
        if (error) throw asAppError(error);
      },
      cleanup: async () => {
        const removed = await client.storage.from(DOCUMENT_BUCKET).remove([path]);
        if (removed.error) throw asAppError(removed.error);
        const deleted = await client.from("dokumen").delete()
          .eq("dokumen_id", documentId).select("dokumen_id").single();
        if (deleted.error) throw asAppError(deleted.error);
      },
      confirm: async () => {
        const { data, error } = await client.from("dokumen")
          .update({ diunggah_pada: new Date().toISOString() }).eq("dokumen_id", documentId)
          .select("dokumen_id,user_id,nama_file,lokasi_file,ukuran_file,status_proses,dibuat_pada,diunggah_pada").single();
        if (error) throw asAppError(error);
        return data;
      },
    });
  } catch (error) {
    const safeError = asAppError(error);
    throw new AppError(safeError.code, safeError.status, documentId);
  }
}
