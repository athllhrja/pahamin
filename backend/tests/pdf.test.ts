import assert from "node:assert/strict";
import test from "node:test";
import { PDFDocument, PDFName, PDFDict } from "pdf-lib";
import { validatePdf } from "../validation/pdf";
import { MAX_UPLOAD_BYTES } from "../config";

function file(bytes: Uint8Array | string) {
  return new File([typeof bytes === "string" ? bytes : new Uint8Array(bytes)], "materi.pdf", { type: "application/pdf" });
}

test("valid PDF with a page passes server validation", async () => {
  const pdf = await PDFDocument.create();
  pdf.addPage().drawText("Materi belajar");
  await validatePdf(file(await pdf.save()));
});

test("renamed ZIP, EXE, broken PDF and empty file are rejected", async () => {
  for (const content of ["PK\u0003\u0004zip", "MZ executable", "%PDF-1.7\nbroken", ""]) {
    await assert.rejects(validatePdf(file(content)), { code: "INVALID_PDF" });
  }
});

test("encrypted PDF is rejected with a specific error", async () => {
  const pdf = await PDFDocument.create();
  pdf.addPage();
  const encryption = pdf.context.register(PDFDict.withContext(pdf.context));
  pdf.context.trailerInfo.Encrypt = encryption;
  pdf.context.lookup(encryption, PDFDict).set(PDFName.of("Filter"), PDFName.of("Standard"));
  await assert.rejects(validatePdf(file(await pdf.save())), { code: "PDF_ENCRYPTED" });
});

test("PDF over five MiB is rejected before parsing", async () => {
  await assert.rejects(validatePdf(file(new Uint8Array(MAX_UPLOAD_BYTES + 1))), { code: "INVALID_PDF" });
});
