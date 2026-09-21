# Product Requirements Document (PRD) — PahaMIn Web App

## 1. Ringkasan Proyek
**PahaMIn** adalah aplikasi web asisten produktivitas terpadu yang dirancang untuk mengatasi masalah beban mental (*cognitive load*) dan kelumpuhan analisis (*analysis paralysis*) di kalangan mahasiswa. Aplikasi ini menggabungkan manajemen waktu berbasis *Eisenhower Matrix* dengan fitur penyederhanaan materi akademik menggunakan AI (*Personalize Explanation*).

**Tim Pengembang (INTERCORP):**
- **Calvin Immanuel Lado:** Backend, Database, Auth, Integrasi UI-Database, Deployment.
- **Krisna Putra Wicaksana:** Frontend, Layout UI Matriks, Aksesibilitas, UI/UX.
- **Andi Athallah Radja:** AI Backend, Python Engine, Integrasi UI-AI.
- **Alda:** QA Lead, Software Tester, Prompt Tester, Data Sampling, System Documentation, & Support UI.

---

## 2. Kebutuhan Fungsional (Functional Requirements)

### 2.1. Matriks Tugas (Manajemen Prioritas)
- **Fungsi Utama:** Sistem memvisualisasikan tugas ke dalam 4 kuadran interaktif secara otomatis berdasarkan matriks Eisenhower (*Do First, Schedule, Delegate, Don't Do*).
- **Input:** Data nama tugas, tingkat urgensi (tinggi/rendah), dan tingkat kepentingan (tinggi/rendah).
- **Output:** Kartu tugas ditampilkan pada kuadran yang tepat di layar.
- **Interaksi:** Pengguna dapat melakukan penyesuaian jadwal secara manual melalui fitur *drag-and-drop* antar kuadran dan menandai tugas selesai.

### 2.2. Ruang Paham (AI Learning Assistant)
- **Fungsi Utama:** Sistem menghasilkan ringkasan materi secara otomatis untuk menyederhanakan teks yang kompleks.
- **Input:** File dokumen (PDF) atau teks materi akademik yang diunggah oleh pengguna.
- **Output:** Teks ringkasan materi akademik yang disajikan dalam bentuk poin-poin (*bullet points*) pada layar *reading view*.

### 2.3. AI Quiz Generator
- **Fungsi Utama:** Membuat soal evaluasi untuk menguji pemahaman instan pengguna terhadap ringkasan materi.
- **Input:** Ekstraksi teks dari dokumen materi yang telah diproses oleh sistem AI.
- **Output:** Daftar soal pilihan ganda (A, B, C, D) beserta tampilan skor akhir setelah pengguna menjawab kuis.

### 2.4. Dasbor Profil & Gamifikasi
- **Rekam Jejak:** Sistem memantau dan menampilkan data statistik pengguna, meliputi jumlah aktivitas belajar, riwayat file yang diproses, jumlah kuis yang diselesaikan, dan perhitungan runtutan belajar harian (*streak counter*).

---

## 3. Kebutuhan Non-Fungsional (Non-Functional Requirements)

### 3.1. Response Time (Waktu Respons AI)
- Proses *generate* ringkasan materi atau soal kuis oleh AI harus diselesaikan **dalam batas waktu kurang dari 10 detik** setelah pengguna menekan tombol aksi. Hal ini krusial untuk menjaga kontinuitas pemikiran (*continuity of thought*) pengguna saat belajar.

### 3.2. Usability & Aksesibilitas (Reduce Memory Work)
- Antarmuka harus sederhana dan intuitif agar tidak membebani memori (*Reduce Memory Work*) maupun beban intelektual pengguna.
- **Aksesibilitas Multi-moda:** Harus mencakup dukungan interaksi *Voice Input* (ikon mikrofon) untuk meminimalkan pengetikan manual, dan *Text-to-Speech* (ikon *speaker*) untuk disabilitas visual ringan/kelelahan mata.
- **Konsistensi Visual:** Tombol primer harus selalu berwarna **Biru (#2563EB)** untuk menjaga navigasi yang dapat diprediksi (*predictable*).

---

## 4. Batasan Arsitektur & Teknologi (Tech Stack)
Sistem PahaMIn menggunakan arsitektur terpisah (*Monorepo Light*) dengan pedoman ketat:
- **Frontend UI/UX:** Next.js (TypeScript), Tailwind CSS, dan shadcn/ui.
- **State Management:** Zustand (untuk mengelola *Optimistic UI* pada *drag-and-drop* Matriks Tugas).
- **Backend AI Engine:** FastAPI (Python) dengan integrasi PyMuPDF untuk proses *parsing* file akademik (*server-side*).
- **Database & Auth:** Supabase (PostgreSQL) dengan penerapan *Row Level Security* (RLS) untuk isolasi data pengguna secara aman.
- **AI Integrations:** LLM API (Google Gemini / OpenAI).