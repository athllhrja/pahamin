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

### 2.2. Ruang Paham (RAG Chatbot)
- **Fungsi Utama:** Sistem mengubah dokumen akademik menjadi basis pengetahuan interaktif. Pengguna dapat bertanya-jawab dengan materi secara percakapan (*chatbot*) menggunakan metode **RAG (Retrieval-Augmented Generation)**.
- **Input:** File dokumen (PDF, maksimal 20 halaman) yang diunggah oleh pengguna.
- **Output:** Ringkasan otomatis dokumen dan respons percakapan yang menjawab pertanyaan pengguna berdasarkan materi, ditampilkan pada antarmuka *chat* (*reading view*).

### 2.3. Dasbor Profil & Gamifikasi
- **Rekam Jejak:** Sistem memantau dan menampilkan data statistik pengguna, meliputi jumlah aktivitas belajar, riwayat file yang diproses, jumlah percakapan Ruang Paham, dan perhitungan runtutan belajar harian (*streak counter*).

---

## 3. Kebutuhan Non-Fungsional (Non-Functional Requirements)

### 3.1. Response Time (Waktu Respons AI)
- Proses *generate* ringkasan materi atau respons percakapan oleh AI harus diselesaikan **dalam batas waktu kurang dari 10 detik** setelah pengguna menekan tombol aksi atau mengirim pertanyaan. Hal ini krusial untuk menjaga kontinuitas pemikiran (*continuity of thought*) pengguna saat belajar.

### 3.2. Usability & Aksesibilitas (Reduce Memory Work)
- Antarmuka harus sederhana dan intuitif agar tidak membebani memori (*Reduce Memory Work*) maupun beban intelektual pengguna.
- **Aksesibilitas Multi-moda:** Harus mencakup dukungan interaksi *Voice Input* (ikon mikrofon) untuk meminimalkan pengetikan manual, dan *Text-to-Speech* (ikon *speaker*) untuk disabilitas visual ringan/kelelahan mata.
- **Konsistensi Visual:** Tombol primer harus selalu berwarna **Biru (#2563EB)** untuk menjaga navigasi yang dapat diprediksi (*predictable*).

---

## 4. Batasan Arsitektur & Teknologi (Tech Stack)
Sistem PahaMIn menggunakan arsitektur terpisah (*Monorepo Light*) dengan pedoman ketat:
- **Frontend UI/UX:** Next.js (TypeScript), Tailwind CSS, dan shadcn/ui.
- **State Management:** Zustand (untuk mengelola *Optimistic UI* pada *drag-and-drop* Matriks Tugas).
- **Backend AI Engine:** FastAPI (Python) dengan integrasi PyMuPDF untuk proses *parsing* file akademik (*server-side*) dan pipeline RAG (*chunking*, *embedding*, *retrieval*).
- **Database & Auth:** Supabase (PostgreSQL) dengan penerapan *Row Level Security* (RLS) untuk isolasi data pengguna dan ekstensi **pgvector** untuk penyimpanan vektor embedding.
- **AI Integrations:** Model LLM lokal **Ollama** — `qwen 3.6` untuk *chat generation* dan `nomic-embed-text` untuk embedding dokumen (tanpa API berbayar).

## 5. Karakteristik Pengguna & Hak Akses (Actors)
Sistem PahaMIn memiliki target pengguna spesifik dengan batasan hak akses berikut:
- **Pengguna Reguler (Mahasiswa):** Memiliki hak akses penuh untuk membuat dan memindahkan tugas pada Matriks Eisenhower, mengunggah dokumen PDF, membaca ringkasan AI, dan bertanya-jawab dengan materi melalui Ruang Paham (RAG chatbot). Pengguna hanya dapat melihat dan memodifikasi datanya sendiri (diisolasi oleh *Row Level Security*).
- **Administrator Sistem (Developer/Calvin):** Tidak memiliki antarmuka khusus di dalam aplikasi. Pengelolaan data tingkat lanjut, pemantauan *traffic*, dan manajemen *storage* dilakukan langsung melalui dasbor *backend* Supabase.

## 6. Lingkungan Operasi (Operating Environment)
Aplikasi PahaMIn beroperasi dengan spesifikasi lingkungan sebagai berikut:
- **Platform Aplikasi:** Berbasis Web (*Web-based Application*).
- **Dukungan Peramban (Browser):** Google Chrome, Mozilla Firefox, Apple Safari, dan Microsoft Edge versi terbaru (mendukung fitur CSS Grid dan *drag-and-drop* API).
- **Resolusi & Aksesibilitas Layar:** 
  - **Desktop/Tablet (Optimal):** Layar dengan resolusi minimal 1024px direkomendasikan untuk pengalaman interaksi *drag-and-drop* 4 kuadran Matriks Eisenhower yang maksimal.
  - **Mobile (Fungsional):** Antarmuka Matriks akan merespons menjadi tata letak vertikal (*stacked*) pada layar di bawah 768px untuk menjaga keterbacaan, meskipun *drag-and-drop* akan dibatasi fungsinya menjadi tombol *tap-to-move*.

## 7. Batasan Sistem & Aturan Bisnis (System Constraints)
Untuk menjaga stabilitas peladen, mengontrol biaya API LLM, dan mencegah kegagalan sistem, PahaMIn menetapkan batasan masukan berikut:
- **Batas Unggah Dokumen (Ruang Paham):** 
  - Format file yang diizinkan secara eksklusif hanya ekstensi `.pdf`.
  - Ukuran maksimal dokumen yang diunggah dibatasi **5 Megabyte (MB)** per file.
  - Batas ekstraksi teks maksimal adalah **20 halaman** pertama dari dokumen untuk mencegah *overload* konteks pada model dan menjaga kinerja.
- **Batasan Pipeline RAG:** Teks dipecah menjadi *chunks* **±500 token** dengan overlap **50 token**; *retrieval* mengambil maksimal **5 *chunks*** terdekat per pertanyaan.
- **Ketersediaan LLM:** Model berjalan lokal melalui Ollama (deployment development only). Lingkungan wajib menginstal Ollama beserta model `qwen 3.6` dan `nomic-embed-text`.
- **Ketersediaan Offline:** Sistem tidak mendukung mode *offline*. Pengguna memerlukan koneksi internet aktif untuk memuat Matriks dan memproses PDF ke peladen FastAPI.

## 8. Kebutuhan Data Konseptual (Conceptual Data Requirements)
Skema basis data PahaMIn memetakan entitas relasional utama berikut untuk disimpan dalam PostgreSQL (Supabase):
1. **Entitas `users_profile` (Profil):** Menyimpan `user_id` (UUID), alamat email, *streak* harian, dan total dokumen yang diproses.
2. **Entitas `tasks` (Matriks):** Menyimpan `task_id`, `user_id` (Foreign Key), `title` (Nama tugas), `quadrant` (Status letak kuadran: 1, 2, 3, atau 4), posisi, dan `created_at`.
3. **Entitas `documents` (Ruang Paham):** Menyimpan `doc_id`, `user_id`, `file_name`, jumlah halaman, status pemrosesan, dan penanda waktu.
4. **Entitas `document_chunks` (RAG):** Menyimpan `chunk_id`, `doc_id` (Foreign Key), urutan *chunk*, teks, dan kolom vektor embedding (pgvector) untuk *similarity search*.
5. **Entitas `chat_messages` (RAG):** Menyimpan `message_id`, `doc_id` (referensi dokumen), `user_id`, peran (user/assistant), dan konten percakapan.

## 9. Antarmuka Eksternal (External Interfaces)
- **LLM Lokal (Ollama):** FastAPI berkomunikasi dengan server Ollama lokal melalui HTTP (`OLLAMA_HOST`). Model `qwen 3.6` digunakan untuk *chat generation* dan `nomic-embed-text` untuk embedding. Tidak ada ketergantungan API eksternal berbayar.
- **Vektor DB:** Supabase pgvector menyimpan embedding `document_chunks`; FastAPI melakukan *similarity search* vektor untuk retrieval.
- **Cloud Storage:** Penyimpanan fisik file PDF diintegrasikan langsung menggunakan Supabase Storage (S3-compatible) sebelum diproses oleh PyMuPDF.