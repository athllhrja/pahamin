# Handoff Sesi: Scaffolding PahaMIn (web/ + api/)

Prompt ini disusun untuk menyerahkan hasil sesi pengerjaan scaffolding kepada AI agent lain. Berikan prompt ini secara utuh sebagai instruksi awal, lalu ikuti langkah-langkah kerja yang diminta pengguna.

---

Kamu adalah AI agent untuk proyek **PahaMIn** (tim INTERCORP). Proyek ini adalah asisten produktivitas bagi mahasiswa: manajemen tugas berbasis Matriks Eisenhower + asisten belajar AI (Ruang Paham, **RAG chatbot** dengan LLM lokal Ollama).

**MULAI dengan membaca file berikut secara utuh, urut:**
1. `C:\Users\Lenov\pahamin\.cursorrules` — aturan penulisan kode & arsitektur yang WAJIB dipatuhi tanpa terkecuali.
2. `C:\Users\Lenov\pahamin\docs\project-requirements.md` — PRD lengkap (fungsional, non-fungsional, batasan sistem, data).
3. `C:\Users\Lenov\pahamin\docs\CONTEKST_PROYEK.md` — konteks, pembagian peran tim, dan jadwal SCRUM (Sprint 0–3).
4. `C:\Users\Lenov\pahamin\docs\UI_DESIGN_REFERENCE.md` dan `C:\Users\Lenov\pahamin\docs\design-reference\figma-exports\` — UI/UX PahaMIn yang sudah dirancang di Figma dan menjadi acuan visual wajib. Jangan mulai ulang desain UI.
5. `C:\Users\Lenov\pahamin\docs\prompts\` — seluruh prompt peran (api-designer, task-breakdown, dll). Gunakan prompt peran yang relevan jika pengguna meminta output dalam format peran tersebut.

## Perubahan scope terbaru (keputusan tim — PERHATIKAN, dokumentasi & aturan sudah disinkronkan)
1. **Fitur Kuis AI DIHAPUS** — tabel `quiz_results` dan seluruh UI/endpoint kuis tidak lagi diperlukan.
2. **Ruang Paham menjadi RAG Chatbot** — user upload PDF, lalu tanya-jawab interaktif dengan materi. Alur: PyMuPDF ekstraksi (max 20 halaman) → chunking ±500 token (overlap 50) → embedding `nomic-embed-text` → simpan vektor di Supabase pgvector (`document_chunks`) → similarity search (top-5 chunks) → prompt ke model chat → respons di UI chat; riwayat disimpan di `chat_messages`.
3. **Provider AI = Ollama lokal** menggantikan Gemini/OpenAI — model chat `qwen 3.6`, model embedding `nomic-embed-text`, tanpa API berbayar.
4. **Skema database rencana (5 tabel):** `users_profile`, `tasks`, `documents`, `document_chunks`, `chat_messages`. Semua dengan RLS berbasis `auth.uid()`. **Database belum di-setup** (menunggu konsep final + prasyarat).

## Prasyarat lingkungan yang belum terpenuhi
- Project Supabase (aktifkan ekstensi `vector`/pgvector) + isi credentials.
- Ollama terpasang dengan model `qwen 3.6` dan `nomic-embed-text` (`curl http://localhost:11434/api/tags` untuk cek status server).
- Isi env vars di bawah.

## Hasil sesi sebelumnya (sudah dikerjakan — JANGAN ulangi)

### Scaffolding `web/` (Frontend Next.js)
- **Versi terpasang:** Next.js 16.3.5, React 19.2.8, TypeScript (strict), Tailwind CSS v4, App Router, struktur tanpa folder `src/`.
- **Dependensi terpasang:** zod, react-hook-form, @hookform/resolvers, zustand, sonner, @supabase/ssr, @supabase/supabase-js, @hello-pangea/dnd, clsx, tailwind-merge, cn, lucide-react.
- **shadcn/ui** style "base-nova" sudah diinit (`components.json`) + 16 komponen di `components/ui/` (button, card, input, label, select, textarea, dialog, alert-dialog, badge, skeleton, table, tabs, separator, alert, tooltip, sonner).
- **Tema warna PahaMIn** sudah diterapkan di `app/globals.css` (light & dark): Primary `#2563EB`, Background `#F3F4F6`, Card `#FFFFFF`, Teks `#6B7280`.
- `app/layout.tsx` — metadata PahaMIn, `lang="id"`, `Toaster` (Sonner) terpasang.
- `app/page.tsx` — landing page placeholder ber-merk (Card + Button + Link).
- Infra Supabase: `lib/supabase/client.ts` (browser), `lib/supabase/server.ts` (async `cookies()`), `proxy.ts` (refresh sesi; pengganti `middleware.js` di Next 16).
- `web/.env.example` berisi placeholder env var.

### Scaffolding `api/` (Backend FastAPI)
- FastAPI + Pydantic v2 + python-dotenv + PyMuPDF (`requirements.txt`).
- `main.py` (CORS allow `http://localhost:3000`), `routers/health.py` (GET `/health`), `schemas.py` (Pydantic models).
- Virtual environment Python 3.10 ada di `api/.venv/`.

### Status verifikasi (SUDAH LULUS)
- Frontend: `npx tsc --noEmit` OK, `npx eslint .` bersih, `npm run build` sukses (rute `/` ter-prerender, `Proxy` terdaftar).
- Backend: endpoint `/health` merespons `200 {"status":"ok","service":"pahamin-api"}`.

### Repo / git
- Branch `main`. Kode scaffolding web/ + api/ **belum di-commit**.
- File `docs/CONTEKST_PROYEK.md` masih untracked.
- Perubahan lain: `.gitignore` root baru (backend), `web/.gitignore` diperbaiki agar `.env.example` ikut ter-commit.

## Poin teknis penting (realita tooling yang menyimpang dari .cursorrules)
- **Next.js 16, bukan 15+** — `cookies()`, `headers()`, `params`, `searchParams` HANYA bisa async (jangan akses sinkron).
- **`middleware` sudah diganti `proxy.ts`** — file sudah ada; fungsi ekspor bernama `proxy`.
- **shadcn terbaru pakai Base UI, bukan Radix** — tombol/link memakai prop `render` (elemen, mis. `render={<Link href="/x" />}`), BUKAN `asChild`.
- `@hello-pangea/dnd` sudah terpasang untuk drag-and-drop Matriks (Sprint 2).

## Env vars yang WAJIB diisi pengguna sebelum menjalankan dev (aturan `.cursorrules` §12 — beri tahu pengguna, jangan dianggap ada)
- `web/.env.local`: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (keduanya publik/browser-safe).
- `api/.env`: `OLLAMA_HOST` (server-only, mis. `http://localhost:11434`), `OLLAMA_CHAT_MODEL` (untuk qwen 3.6 — server-only), `OLLAMA_EMBED_MODEL` (`nomic-embed-text` — server-only), `SUPABASE_URL` (server-only), `SUPABASE_SERVICE_ROLE_KEY` (server-only).
- Tanpa env Supabase di `web/.env.local`, dev server akan error di `proxy.ts` ("URL and Key are required to create a Supabase client!").

## Kepatuhan aturan selama kamu bekerja
- JANGAN tulis komentar deskriptif/boilerplate di kode (hanya izinkan direktif `"use client"`, `"use server"`, `import "server-only"`).
- Dilarang `any`; gunakan `unknown` + type narrowing. Fungsi Python wajib punya type hints parameter & return.
- Jangan tinggalkan dead code, kode komentar, atau file > 200 baris.
- Validasi input frontend wajib Zod + react-hook-form + zodResolver; backend wajib Pydantic.
- Error jangan ditelan diam-diam — catat via console, tampilkan ke pengguna via Sonner.
- Kalau perlu env var baru di luar daftar di atas, BERTANYA ke pengguna dan minta ditambahkan ke `.env.example` yang sesuai.

## Cara verifikasi
- Frontend: `npm run build` (workdir `web/`), `npx tsc --noEmit`, `npx eslint .`.
- Backend: jalankan `api/.venv\Scripts\python.exe -m uvicorn main:app --port 8001`, lalu `GET /health`.
- Ollama: `curl http://localhost:11434/api/tags` untuk memastikan model `qwen 3.6` dan `nomic-embed-text` tersedia.

## Target berikutnya (tunggu instruksi pengguna)
- **Sprint 1 target (Minggu VII): Auth & Login.** Dimulai dari: setup database Supabase (5 tabel + RLS + pgvector), lalu middleware auth (`proxy.ts` sudah ada), halaman login/register, dan protected routes.
- Rencana sprint lanjutan: Sprint 2 = Matriks Eisenhower (drag-and-drop + Optimistic UI) + Ruang Paham RAG (upload PDF + chat); Sprint 3 = Dashboard profil, Aksesibilitas, QA + user manual.

Kerjakan hanya sesuai instruksi terbaru dari pengguna. Selalu laporkan hasil verifikasi (typecheck/lint/build/health) sebelum menganggap pekerjaan selesai.
