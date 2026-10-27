# PahaMIn

PahaMIn adalah web app untuk membantu mahasiswa mengelola prioritas tugas dengan Matriks Eisenhower dan memahami materi akademik melalui Ruang Paham berbasis dokumen PDF.

## Status Proyek

Repository ini masih berada pada tahap scaffolding dan persiapan pengembangan.

- Frontend Next.js sudah memiliki kerangka aplikasi, landing page sementara, komponen UI dasar, dan klien Supabase.
- Backend FastAPI saat ini menyediakan endpoint pemeriksaan kesehatan `/health`.
- Halaman produk, autentikasi yang terhubung, matriks tugas, pemrosesan PDF, dan chatbot RAG belum selesai diimplementasikan.
- Desain UI/UX sudah tersedia dan menjadi acuan implementasi. Jangan membuat ulang desain dari nol atau mengganti arah visualnya.

## Struktur Repository

```text
pahamin/
├── api/                         # Backend FastAPI untuk fitur AI
├── docs/                        # Dokumentasi rekayasa, manajemen proyek, dan acuan desain
│   ├── PC/                      # Dokumen dan aset Project Charter
│   ├── PMP/                     # Dokumen dan aset Project Management Plan
│   ├── design-reference/        # Ekspor layar Figma (31 PNG)
│   ├── panduan/                 # Panduan tim, prompt, desain, dan aturan coding
│   └── prompts/                 # Template prompt peran AI
├── web/                         # Frontend Next.js
├── .cursorrules                 # Penunjuk untuk tool ke aturan coding lengkap
├── .gitignore                   # Aturan file yang tidak dimasukkan ke Git
├── AGENTS.md                    # Instruksi untuk coding agent
└── README.md                    # Panduan awal proyek
```

## Teknologi

- Frontend: Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, dan Supabase SSR.
- Backend AI: FastAPI, Python, PyMuPDF, Supabase pgvector, dan Ollama.
- Database dan autentikasi: Supabase.

Gunakan berkas manifest masing-masing aplikasi sebagai sumber versi dependency: `web/package.json` dan `api/requirements.txt`.

## Persiapan UI/UX

Desain Figma yang sudah dibuat adalah sumber visual utama. Sebelum membangun atau mengubah halaman, baca:

- `docs/panduan/UI_DESIGN_REFERENCE.md`
- `docs/design-reference/figma-exports/`
- Bagian UI pada `docs/project-requirements.md`

Bangun tampilan dengan komponen web yang berfungsi. PNG hanya menjadi referensi, bukan gambar screenshot untuk menggantikan halaman. Jika suatu keadaan atau interaksi tidak dijelaskan oleh desain dan dokumen, klarifikasi sebelum membuat perubahan visual yang substantif.

## Prasyarat

- Node.js dan npm untuk frontend.
- Python dan pip untuk backend.
- Project Supabase untuk database dan autentikasi saat integrasi tersebut dikerjakan.
- Ollama dan model yang disepakati tim untuk fitur AI saat pipeline RAG dikerjakan.

## Menjalankan Frontend

Buka terminal di folder `web`, lalu jalankan:

```bash
npm ci
```

Buat `web/.env.local` berdasarkan `web/.env.example`:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
FASTAPI_URL=http://127.0.0.1:8000
```

Nilai Supabase berasal dari pengaturan project Supabase. `NEXT_PUBLIC_SUPABASE_ANON_KEY` adalah kunci publik untuk client; `FASTAPI_URL` dipakai oleh route handler sisi server (DD-01) dan tidak boleh diberi awalan `NEXT_PUBLIC_`. Jangan masukkan service role key atau secret server ke berkas frontend.

Kemudian, dari folder `web`, jalankan (terikat ke loopback `127.0.0.1`):

```bash
npm run dev -- -H 127.0.0.1 -p 3000
```

Buka `http://localhost:3000` di browser. Saat ini halaman yang tampil masih berupa landing page sementara.

## Menjalankan Backend AI

Buat dan aktifkan virtual environment Python di folder `api`, lalu pasang dependency:

```bash
python -m venv .venv
```

Di Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

Di macOS/Linux:

```bash
source .venv/bin/activate
```

Lanjutkan dari folder `api`:

```bash
python -m pip install -r requirements.txt
```

Salin `api/.env.example` menjadi `api/.env` dan isi nilai yang diperlukan ketika integrasi Ollama atau Supabase backend dikerjakan. Sesuai keputusan desain `DD-02`, FastAPI mengakses Supabase menggunakan `SUPABASE_ANON_KEY` dan meneruskan JWT pengguna agar Row Level Security (RLS) selalu berlaku; `SUPABASE_SERVICE_ROLE_KEY` tidak dipakai oleh aplikasi dan tidak boleh disimpan di `.env` aplikasi maupun repository.

Jalankan server lokal dari folder `api` (terikat ke loopback `127.0.0.1`):

```bash
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

Endpoint pemeriksaan kesehatan tersedia di `http://127.0.0.1:8000/health`. Endpoint pemrosesan PDF dan RAG belum tersedia.

## Panduan Proyek

- `docs/project-requirements.md`: kebutuhan produk (PRD), scope, alur pengguna, dan keputusan produk.
- `docs/SKPL_PahaMIn_INTERCORP_v1.3.md`: Spesifikasi Kebutuhan Perangkat Lunak (SRS) v1.3.
- `docs/DPPL_PahaMIn_INTERCORP_v1.3.md`: Deskripsi Perancangan Perangkat Lunak (SDD) v1.3.
- `docs/Class_Diagram_PahaMIn.md`: class diagram domain dan layanan beserta evaluasi normalisasi 1NF–3NF.
- `docs/PPT Progress Pahamin.pptx`: presentasi progress perancangan selaras SKPL & DPPL v1.3.
- `docs/PC/` dan `docs/PMP/`: dokumen serta aset visual Project Charter dan Project Management Plan.
- `docs/CONTEKST_PROYEK3.md`: konteks dan status teknis yang tercatat untuk handoff.
- `docs/design-brief.md`: keputusan dan spesifikasi desain sebelum implementasi UI.
- `docs/panduan/UI_DESIGN_REFERENCE.md`: aturan implementasi desain Figma.
- `docs/design-reference/figma-exports/`: ekspor 31 layar UI/UX Figma.
- `docs/panduan/README.md`: indeks isi folder panduan.
- `docs/panduan/Panduan_Prompt_AI.md`: cara memilih dan menggunakan prompt peran AI.
- `docs/panduan/.cursorrules`: satu-satunya sumber lengkap aturan coding dan arsitektur.
- `AGENTS.md` dan `.cursorrules` di root: penunjuk agar coding agent/tool membaca aturan lengkap tersebut.
- `docs/panduan/Panduan_Persiapan_Tim_Proyek_PahaMIn.docx`: panduan persiapan anggota tim.

Sebelum mengerjakan tugas, periksa status Git agar perubahan lokal anggota tim tetap aman. Jangan mengirim kredensial, password, API key, atau isi berkas `.env` ke Git atau prompt AI.
