export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
export const MAX_DOCS_PER_USER = 10;
export const DOCUMENT_BUCKET = "dokumen-pdf";
export const SUPABASE_TIMEOUT_MS = 10_000;
export const PRIVATE_PATHS = ["/tugas", "/ruang-paham"];

export function getPublicConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || new URL(url).protocol !== "https:" || new URL(url).username || new URL(url).password) {
    throw new Error("Konfigurasi Supabase HTTPS belum lengkap.");
  }
  if (key.startsWith("sb_secret_")) throw new Error("Gunakan kunci publik Supabase.");
  if (key.split(".").length === 3) {
    try {
      const payload = JSON.parse(atob(key.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))) as { role?: string };
      if (payload.role !== "anon") throw new Error("Gunakan kunci publik Supabase.");
    } catch {
      throw new Error("Gunakan kunci publik Supabase.");
    }
  }
  return { url, key };
}
