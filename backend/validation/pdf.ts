import { PDFDocument } from "pdf-lib";
import { AppError } from "../errors";
import { uploadSchema } from "../schemas";

export async function validatePdf(file: File) {
  if (!uploadSchema.safeParse({ file }).success) throw new AppError("INVALID_PDF", 422);
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (new TextDecoder().decode(bytes.subarray(0, 5)) !== "%PDF-") {
    throw new AppError("INVALID_PDF", 422);
  }
  try {
    const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true, throwOnInvalidObject: true, updateMetadata: false });
    if (pdf.isEncrypted) throw new AppError("PDF_ENCRYPTED", 422);
    if (pdf.getPageCount() < 1) throw new AppError("INVALID_PDF", 422);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("INVALID_PDF", 422);
  }
}
