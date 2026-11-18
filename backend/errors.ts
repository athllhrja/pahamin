export const ERROR_MESSAGES = {
  FORBIDDEN: "Permintaan tidak diizinkan.",
  PAYLOAD_TOO_LARGE: "Ukuran unggahan melebihi batas yang diizinkan.",
  PDF_ENCRYPTED: "PDF terenkripsi tidak dapat diunggah. Gunakan PDF tanpa kata sandi.",
  AUTH_INVALID: "Sesi tidak valid. Silakan masuk kembali.",
  LOGIN_FAILED: "Email atau kata sandi tidak sesuai.",
  VALIDATION_ERROR: "Periksa kembali data yang diisi.",
  INVALID_PDF: "Pilih berkas PDF yang valid, tidak kosong, dan maksimal 5 MB.",
  QUOTA_EXCEEDED: "Maksimal 10 dokumen per akun.",
  UPSTREAM_UNAVAILABLE: "Layanan belum tersedia. Silakan coba lagi.",
  CLEANUP_REQUIRED: "Unggahan gagal dan pembersihan belum selesai. Hubungi pengelola untuk memeriksa berkas ini.",
} as const;

export type ErrorCode = keyof typeof ERROR_MESSAGES;

export class AppError extends Error {
  constructor(public code: ErrorCode, public status = 500, public documentId?: string) {
    super(ERROR_MESSAGES[code]);
  }
}

export function asAppError(error: unknown): AppError {
  if (error instanceof AppError) return error;
  if (error && typeof error === "object" && "code" in error) {
    const code = String(error.code);
    const message = "message" in error ? String(error.message) : "";
    if (message === "QUOTA_EXCEEDED") return new AppError("QUOTA_EXCEEDED", 429);
    if (code === "42501" || code === "PGRST301") return new AppError("AUTH_INVALID", 401);
    if (["23514", "23503", "22P02", "22001"].includes(code)) return new AppError("VALIDATION_ERROR", 422);
  }
  return new AppError("UPSTREAM_UNAVAILABLE", 503);
}

export function reportError(error: unknown, operation: string) {
  const safeError = asAppError(error);
  console.error({ operation, code: safeError.code });
  return safeError;
}
