# Ringkasan Konteks Proyek PahaMIn

## 1. Identitas Proyek & Tim (INTERCORP)
- **Nama Proyek:** PahaMIn (Platform Manajemen Tugas Matriks Eisenhower & Asisten Belajar AI Ruang Paham).
- **Anggota & Peran:**
  - Calvin: Backend, Database (Supabase), Auth, Deployment.
  - Krisna: Frontend (Next.js/TypeScript), UI/UX, State (Zustand), Aksesibilitas.
  - Andi: AI Engineer, FastAPI (Python), PyMuPDF, Pipeline RAG (Ollama).
  - Alda: QA Lead (Tester), Scrum Master, Prompt Tester, Dokumentasi.

## 2. Tech Stack & Limitasi
- **Frontend:** Next.js, TypeScript, Zustand, Tailwind CSS, shadcn/ui.
- **Backend AI:** FastAPI, Python, PyMuPDF, Ollama lokal (qwen 3.6 + nomic-embed-text), Supabase pgvector.
- **Database & Auth:** Supabase (PostgreSQL), Row Level Security (RLS).
- **Batasan Sistem:** Upload PDF max 5MB, ekstraksi max 20 halaman, format .pdf saja.

## 3. Kerangka Kerja Perkuliahan (SE-IMPTEST - SCRUM)
- **Pendekatan:** SCRUM dengan 3 Sprint (Target Selesai Minggu ke-13).
- **Evaluasi Terdekat (Sprint 0 - Minggu IV):** Pengecekan spesifikasi SRS/SKPL, SDD (Rancangan Database Supabase), dan Prototipe UI Figma.
- **Target Sprint 1 (Minggu VII):** Auth & Login Use Case.
- **Target Sprint 2 (Minggu X):** Core Feature (Matriks Eisenhower & Upload PDF AI).
- **Target Sprint 3 (Minggu XIII):** Dashboard profil, Aksesibilitas, Testing (QA), User Manual.

## 4. Status Terakhir
- Seluruh file instruksi AI (`docs/prompts/`) dan SKPL awal sudah tersimpan di repositori GitHub (`https://github.com/athllhrja/pahamin.git`).
- Scaffolding monorepo selesai: frontend `web/` (Next.js 16) dan backend `api/` (FastAPI) sudah berdiri dan terverifikasi (build & health check).
- Keputusan scope terbaru (evaluasi internal): fitur **kuis AI dihapus**, Ruang Paham diubah menjadi **RAG chatbot** interaktif, dan provider AI beralih ke **Ollama lokal** (`qwen 3.6` + `nomic-embed-text`) menggantikan Gemini/OpenAI.
- **Database Supabase belum di-setup**; menunggu finalisasi skema (5 tabel: `users_profile`, `tasks`, `documents`, `document_chunks`, `chat_messages`) dan kebijakan RLS.
- **Prasyarat dev tambahan:** Ollama terpasang dengan model `qwen 3.6` dan `nomic-embed-text`, serta ekstensi `vector` (pgvector) aktif di project Supabase.