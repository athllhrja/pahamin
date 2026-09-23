# Ringkasan Konteks Proyek PahaMIn — V2 (Status Terkini)

Gunakan dokumen ini sebagai titik masuk (prompt) untuk memahami kondisi proyek PahaMIn saat ini. Untuk aturan koding mutlak, baca `.cursorrules`.

---

## 1. Identitas Proyek & Tim (INTERCORP)
- **Nama Proyek:** PahaMIn (Platform Manajemen Tugas Matriks Eisenhower & Asisten Belajar AI Ruang Paham).
- **Anggota & Peran:**
  - Calvin: Backend, Database (Supabase), Auth, Deployment.
  - Krisna: Frontend (Next.js/TypeScript), UI/UX, State (Zustand), Aksesibilitas.
  - Andi: AI Engineer, FastAPI (Python), PyMuPDF, Pipeline RAG (Ollama).
  - Alda: QA Lead (Tester), Scrum Master, Prompt Tester, Dokumentasi.
- **Repositori:** `https://github.com/athllhrja/pahamin.git` (branch `main`).

## 2. Tech Stack & Limitasi (Terkini)
- **Frontend:** Next.js 16.3.5, React 19.2.8, TypeScript (strict), Tailwind CSS v4, shadcn/ui (Base UI), Zustand, Zod, Sonner.
- **Backend AI:** FastAPI, Python 3.10, PyMuPDF.
- **AI Lokal:** Ollama — `qwen 3.6` (chat generation) + `nomic-embed-text` (embedding). Tanpa API berbayar.
- **Database & Auth:** Supabase (PostgreSQL), Row Level Security (RLS), ekstensi **pgvector**.
- **Batasan Sistem:** Upload PDF maks 5MB, ekstraksi maks 20 halaman, format `.pdf` saja, chunks ±500 token (overlap 50), retrieval top-5 chunks, respons AI < 10 detik.

## 3. Status Perkembangan (Saat Ini)
- **Scaffolding selesai & terverifikasi.** Struktur monorepo:
  - `web/` — Next.js: landing page, tema brand (Primary `#2563EB`, bg `#F3F4F6`, card `#FFFFFF`, teks `#6B7280`), 16 komponen shadcn/ui, infra Supabase (`lib/supabase/client.ts`, `lib/supabase/server.ts`, `proxy.ts`), `.env.example`.
  - `api/` — FastAPI: `main.py` (CORS `localhost:3000`), `routers/health.py` (`GET /health`), `schemas.py`, `requirements.txt`, venv `.venv`, `.env.example`.
- **Verifikasi yang sudah lulus:** `tsc --noEmit`, `eslint`, `next build`, dan `GET /health` → `200 {"status":"ok","service":"pahamin-api"}`.
- **Database Supabase BELUM di-setup** — menunggu finalisasi skema + prasyarat.
- **Kode belum di-commit** sejak sesi scaffolding (branch `main`).

## 3A. Acuan UI/UX Produk
- Tim sudah memiliki desain UI/UX PahaMIn di Figma; layar ekspornya tersedia pada `docs/design-reference/figma-exports/`.
- Desain tersebut adalah sumber acuan visual implementasi web. Jangan membuat UI baru dari awal atau mengubah arah desain secara keseluruhan.
- Cocokkan tampilan, layout, warna, tipografi, ikon, jarak, dan pola interaksi dengan ekspor. Penyesuaian hanya untuk perilaku web, responsivitas, aksesibilitas, dan integrasi data sambil mempertahankan tampilan desain.
- PNG hanya dipakai untuk referensi selama implementasi, bukan sebagai gambar screenshot pengganti antarmuka.
- Lihat `docs/UI_DESIGN_REFERENCE.md` untuk indeks layar dan panduan pencocokan.

## 4. Keputusan Scope Terbaru (Hasil Evaluasi Internal)
1. **Fitur Kuis AI DIHAPUS** — tabel `quiz_results` dan seluruh UI/endpoint kuis tidak perlu dibuat.
2. **Ruang Paham → RAG Chatbot.** Alur: upload PDF → PyMuPDF ekstraksi (maks 20 hal) → chunking ±500 token (overlap 50) → embedding `nomic-embed-text` → simpan vektor di pgvector → saat user bertanya, embed pertanyaan → *similarity search* top-5 chunk → prompt (chunks + pertanyaan + riwayat) ke `qwen 3.6` → respons chat; riwayat disimpan di `chat_messages`.
3. **Provider AI = Ollama lokal** menggantikan Gemini/OpenAI (development only).

## 5. Skema Database Rencana (5 Tabel, Semua Pakai RLS `auth.uid()`)
| Tabel | Isi Utama |
|---|---|
| `users_profile` | `user_id` (UUID), email, streak harian, total dokumen |
| `tasks` | `task_id`, `user_id`, `title`, `quadrant` (1-4), posisi, `created_at` |
| `documents` | `doc_id`, `user_id`, `file_name`, jumlah halaman, status processing |
| `document_chunks` | `chunk_id`, `doc_id`, urutan, teks, vektor embedding (pgvector) |
| `chat_messages` | `message_id`, `doc_id`, `user_id`, role (user/assistant), konten |

## 6. Prasyarat Lingkungan (Belum Terpenuhi)
- [ ] Project Supabase dibuat + ekstensi `vector` (pgvector) diaktifkan.
- [ ] Ollama terpasang + model `qwen 3.6` dan `nomic-embed-text` di-pull.
- [ ] Isi env vars (lihat bagian 7).
- [ ] Tim review & approve finalisasi skema database + kebijakan RLS.

## 7. Env Variables Wajib
- `web/.env.local`: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (publik/browser-safe).
- `api/.env`: `OLLAMA_HOST` (server-only), `OLLAMA_CHAT_MODEL` (server-only), `OLLAMA_EMBED_MODEL` (server-only), `SUPABASE_URL` (server-only), `SUPABASE_SERVICE_ROLE_KEY` (server-only).
- Tanpa env Supabase di `web/.env.local`, dev server error di `proxy.ts` ("URL and Key are required to create a Supabase client!").

## 8. Roadmap Sprint
| Fase | Fokus |
|---|---|
| Sekarang | Finalisasi skema DB (5 tabel + RLS + pgvector), setup Supabase, install Ollama |
| Sprint 1 (Minggu VII) | Auth & Login: setup DB, protected routes, halaman login/register |
| Sprint 2 (Minggu X) | Core: Matriks Eisenhower (drag-and-drop + Optimistic UI) + Ruang Paham RAG (upload PDF + chat) |
| Sprint 3 (Minggu XIII) | Dashboard profil, Aksesibilitas, Testing (QA), User Manual |

## 9. Aturan Wajib Saat Bekerja (Referensi Cepat `.cursorrules`)
- Dilarang komentar deskriptif di kode; exception hanya direktif (`"use client"`, `"use server"`, `import "server-only"`).
- Dilarang `any` — pakai `unknown` + type narrowing; Python wajib type hints lengkap.
- Tidak boleh dead code / kode komentar / file > 200 baris.
- Validasi frontend wajib Zod + react-hook-form + zodResolver; backend wajib Pydantic.
- Error tidak boleh ditelan — catat via console + tampilkan lewat toast Sonner.
- State lintas komponen wajib Zustand (bukan Context).
- Dilarang inline style `style={{...}}`; gunakan Tailwind + `cn()`.
- Env var baru: wajib beri tahu pengguna + tambahkan ke `.env.example`.

## 10. Cara Verifikasi
- Frontend (workdir `web/`): `npx tsc --noEmit`, `npx eslint .`, `npm run build`.
- Backend (workdir `api/`): `.\.venv\Scripts\python.exe -m uvicorn main:app --port 8001`, lalu `GET /health`.
- Ollama: `curl http://localhost:11434/api/tags` untuk cek ketersediaan model.

## 11. Catatan Tooling Penting
- **Next.js 16**: `cookies()`, `headers()`, `params`, `searchParams` HANYA async (jangan akses sinkron).
- **`middleware` diganti `proxy.ts`** — sudah ada di `web/proxy.ts`, fungsi ekspor bernama `proxy`.
- **shadcn/ui pakai Base UI, bukan Radix** — as link/button pakai prop `render` (elemen, mis. `render={<Link href="/x" />}`), bukan `asChild`.
- `@hello-pangea/dnd` sudah terpasang untuk drag-and-drop Matriks (Sprint 2).
