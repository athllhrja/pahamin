# Product Requirements Document PahaMIn

| Informasi | Nilai |
|---|---|
| Produk | PahaMIn |
| Tim | INTERCORP |
| Status dokumen | Rancangan lengkap untuk review tim |
| Versi | 2.0 |
| Terakhir diperbarui | 28 September 2026 |
| Sumber utama | Keputusan scope terbaru, `docs/CONTEKST_PROYEK3.md`, dan `docs/panduan/UI_DESIGN_REFERENCE.md` beserta ekspor layar Figma |

Dokumen ini menjelaskan masalah pengguna, ruang lingkup, kebutuhan fungsional, kualitas layanan, batas sistem, dan keputusan yang masih perlu disepakati. Ketentuan bertanda **Keputusan terbuka** belum boleh dianggap sebagai perilaku produk final.

## 1. Ringkasan Produk

PahaMIn adalah aplikasi web untuk membantu mahasiswa mengelola prioritas tugas dan memahami materi akademik. Produk menyediakan Matriks Tugas berdasarkan Eisenhower serta Ruang Paham, chatbot RAG yang menjawab pertanyaan berdasarkan dokumen PDF yang diunggah pengguna.

Desain UI/UX sudah tersedia di Figma. Ekspor layar yang diberikan tim disimpan di `docs/design-reference/figma-exports/` dan menjadi acuan visual implementasi. Tim membangun antarmuka fungsional yang mengikuti desain tersebut; desain tidak dimulai ulang dari nol. Detail visual dan aturan implementasi dijelaskan di `docs/panduan/UI_DESIGN_REFERENCE.md` dan `docs/panduan/.cursorrules`.

## 2. Masalah dan Tujuan

### 2.1 Masalah Pengguna

- Mahasiswa memiliki banyak tugas dan kesulitan menentukan prioritas yang perlu dikerjakan lebih dahulu.
- Mahasiswa perlu memahami materi akademik yang panjang tanpa harus mencari jawaban secara manual di seluruh dokumen.
- Beban kognitif dan terlalu banyak pilihan dapat membuat pengguna menunda tindakan.

### 2.2 Tujuan Produk

1. Membantu pengguna mengelompokkan dan mengelola tugas dalam empat kuadran prioritas.
2. Membantu pengguna memperoleh ringkasan materi dan jawaban berbasis PDF miliknya.
3. Menampilkan rekam jejak belajar yang membantu pengguna memahami aktivitasnya.
4. Menyediakan alur yang sederhana, konsisten, aksesibel, dan selaras dengan desain Figma.

### 2.3 Bukan Tujuan Produk

- Membuat kuis AI. Fitur kuis telah dihapus dari scope.
- Memberikan jawaban AI yang tidak didasarkan pada dokumen pengguna.
- Menyediakan mode offline.
- Menyediakan panel administrasi khusus di dalam aplikasi. Pengelolaan teknis dilakukan melalui dashboard Supabase.
- Mengandalkan model AI berbayar sebagai provider utama. Provider pengembangan yang diputuskan adalah Ollama lokal.

## 3. Pengguna dan Peran

### 3.1 Mahasiswa

Pengguna utama yang dapat membuat dan mengelola tugas, mengunggah PDF, membaca ringkasan, bertanya kepada materi, dan melihat statistik profil. Setiap pengguna hanya boleh mengakses datanya sendiri.

### 3.2 Administrator Sistem

Developer yang mengelola infrastruktur melalui dashboard Supabase dan lingkungan pengembangan. Tidak ada antarmuka administrator dalam produk.

### 3.3 Tim Pengembang

| Anggota | Tanggung jawab |
|---|---|
| Calvin Immanuel Lado | Backend aplikasi, database/Supabase, autentikasi, integrasi UI-database, dan deployment. |
| Krisna Putra Wicaksana | Frontend Next.js, implementasi UI sesuai Figma, Matriks Tugas, dan aksesibilitas. |
| Andi Athallah Radja | AI backend FastAPI/Python, PyMuPDF, pipeline RAG, dan integrasi Ollama. |
| Alda | QA lead, koordinasi sprint, prompt testing, sampling data, dokumentasi, dan dukungan UI. |

## 4. Ruang Lingkup dan Prioritas

### 4.1 Ruang Lingkup MVP

- Autentikasi dan halaman terlindungi.
- Matriks Eisenhower untuk membuat, mengelompokkan, memindahkan, dan menyelesaikan tugas.
- Ruang Paham untuk mengunggah PDF, menghasilkan ringkasan, bertanya, dan melihat riwayat percakapan.
- Profil dengan statistik aktivitas yang bersumber dari data pengguna.
- Pengaturan dan bantuan yang ditampilkan di desain Figma, dengan perilaku mengikuti keputusan yang disepakati tim.
- Aksesibilitas dasar, dukungan layar kecil, penanganan error, dan isolasi data antarpengguna.

### 4.2 Di Luar Scope MVP

- Kuis dan penilaian otomatis.
- Mode offline.
- Model AI atau layanan generasi berbayar.
- Antarmuka administrasi produk.
- Fitur yang belum tercantum pada spesifikasi atau desain tanpa persetujuan perubahan scope.

## 5. Perjalanan Utama Pengguna

### 5.1 Mengakses Aplikasi

1. Pengguna membuka aplikasi dan masuk atau membuat akun sesuai metode autentikasi yang disepakati.
2. Sistem menjaga sesi dan membatasi halaman serta data sesuai identitas pengguna.
3. Pengguna membuka Matriks Tugas atau Ruang Paham melalui navigasi yang mengikuti desain Figma.

Metode pendaftaran, verifikasi email, pemulihan kata sandi, dan penyedia login pihak ketiga masih merupakan keputusan terbuka.

### 5.2 Mengelola Tugas

1. Pengguna membuat tugas dan mengisi judul, tingkat urgensi, serta tingkat kepentingan.
2. Sistem menempatkan tugas pada kuadran yang sesuai.
3. Pengguna dapat memindahkan tugas secara manual dan menandainya selesai.
4. Perubahan disimpan ke Supabase; bila penyimpanan gagal, tampilan dikembalikan dan pengguna menerima pesan error.

### 5.3 Memahami Dokumen

1. Pengguna memilih atau mengunggah PDF.
2. Sistem memvalidasi format dan ukuran, menyimpan dokumen, lalu meminta FastAPI memproses isi dokumen.
3. FastAPI mengekstrak teks, membuat chunk dan embedding, menyimpan data yang diperlukan, lalu menghasilkan ringkasan.
4. Pengguna bertanya tentang dokumen. Sistem mengambil potongan yang relevan dan meminta Ollama membuat jawaban berdasarkan potongan tersebut.
5. Sistem menyimpan riwayat dan menampilkan status proses, jawaban, atau error yang bisa dipahami.

## 6. Kebutuhan Fungsional

### 6.1 Autentikasi dan Akses

| ID | Prioritas | Kebutuhan dan kriteria penerimaan |
|---|---|---|
| FR-AUTH-01 | Must | Pengguna dapat masuk dan keluar melalui metode autentikasi yang dipilih tim. |
| FR-AUTH-02 | Must | Halaman yang memuat data pribadi hanya dapat diakses setelah sesi valid. Pengguna tanpa sesi diarahkan ke alur autentikasi. |
| FR-AUTH-03 | Must | Setelah autentikasi, pengguna hanya dapat membaca atau mengubah data miliknya sendiri. RLS menegakkan aturan ini di database. |
| FR-AUTH-04 | Must | Kegagalan autentikasi memberi pesan yang jelas tanpa membocorkan detail internal atau rahasia. |

### 6.2 Matriks Tugas

Nama kuadran mengikuti ekspor UI Figma. Maknanya adalah:

| Kuadran | Label desain | Kondisi |
|---|---|---|
| 1 | Do | Mendesak dan penting |
| 2 | Decide | Penting, tidak mendesak |
| 3 | Delegate | Mendesak, tidak penting |
| 4 | Delete | Tidak mendesak dan tidak penting |

Label `Delete` adalah nama kuadran prioritas sesuai desain, bukan perintah menghapus tugas.

| ID | Prioritas | Kebutuhan dan kriteria penerimaan |
|---|---|---|
| FR-TASK-01 | Must | Pengguna dapat membuat tugas dengan judul, tingkat urgensi, dan tingkat kepentingan. Input divalidasi sebelum disimpan. |
| FR-TASK-02 | Must | Sistem menentukan kuadran awal sesuai kombinasi urgensi dan kepentingan pada tabel di atas. |
| FR-TASK-03 | Must | Pengguna dapat melihat tugas pada empat kuadran dan menandai tugas selesai. Status selesai tetap tersimpan setelah halaman dimuat ulang. |
| FR-TASK-04 | Must | Pada perangkat yang mendukung, pengguna dapat memindahkan tugas antar-kuadran. Tampilan merespons segera; kegagalan penyimpanan mengembalikan posisi sebelumnya dan menampilkan notifikasi. |
| FR-TASK-05 | Must | Pada layar di bawah 768 px, kuadran tersusun vertikal dan tugas tetap dapat dipindahkan melalui kontrol yang sesuai untuk sentuhan. Detail visual mobile perlu diselaraskan dengan Figma bila belum tersedia. |
| FR-TASK-06 | Open | Pengeditan judul, penghapusan tugas, tanggal tenggat, prioritas manual, dan perilaku setelah task dipindahkan perlu ditetapkan sebelum menambahkannya ke scope. |

### 6.3 Ruang Paham dan RAG

| ID | Prioritas | Kebutuhan dan kriteria penerimaan |
|---|---|---|
| FR-RAG-01 | Must | Sistem hanya menerima berkas PDF dengan ukuran maksimal 5 MB. Validasi tidak hanya bergantung pada ekstensi nama file. |
| FR-RAG-02 | Must | Sistem mengekstrak paling banyak 20 halaman pertama menggunakan PyMuPDF di backend. Pengguna mendapat status yang jelas selama unggah dan pemrosesan. |
| FR-RAG-03 | Must | Sistem menolak atau menjelaskan dokumen rusak, terenkripsi, kosong, atau tanpa teks yang dapat diekstrak. Kegagalan tidak membuat aplikasi berhenti. |
| FR-RAG-04 | Must | Teks yang berhasil diekstrak dipecah menjadi chunk sekitar 500 token dengan overlap sekitar 50 token. Setiap chunk diberi relasi ke dokumen dan pengguna pemiliknya. |
| FR-RAG-05 | Must | Embedding dibuat menggunakan Ollama `nomic-embed-text` dan disimpan pada PostgreSQL Supabase dengan pgvector. |
| FR-RAG-06 | Must | Saat pertanyaan diajukan, sistem membuat embedding pertanyaan dan mengambil paling banyak lima chunk relevan dari dokumen yang dipilih. Retrieval tidak boleh melintasi dokumen atau akun lain. |
| FR-RAG-07 | Must | Jawaban chat hanya menggunakan isi dokumen yang berhasil diambil sebagai dasar. Jika isi tidak cukup, sistem menyatakan bahwa dokumen tidak memuat informasi yang cukup dan tidak mengarang jawaban. |
| FR-RAG-08 | Must | Ollama menghasilkan keluaran JSON sesuai schema Pydantic. FastAPI memvalidasi keluaran sebelum mengembalikannya ke frontend. |
| FR-RAG-09 | Must | Pengguna dapat membaca ringkasan otomatis dan riwayat percakapan untuk dokumen miliknya. Pesan pengguna dan asisten disimpan dengan urutan yang benar. |
| FR-RAG-10 | Must | Frontend menampilkan status loading, sukses, dan error. Jika Ollama atau Supabase tidak tersedia, pengguna mendapat pesan yang dapat ditindaklanjuti. |
| FR-RAG-11 | Open | Panjang dan struktur ringkasan, sumber/citation pada jawaban, jumlah unggahan per akun, pemrosesan ulang, penghapusan dokumen, dan retensi berkas perlu disepakati. |

### 6.4 Profil, Aktivitas, dan Streak

| ID | Prioritas | Kebutuhan dan kriteria penerimaan |
|---|---|---|
| FR-PROFILE-01 | Must | Profil menampilkan statistik aktivitas belajar, riwayat dokumen yang diproses, jumlah percakapan Ruang Paham, dan streak sesuai ekspor UI serta data yang tersedia. |
| FR-PROFILE-02 | Must | Statistik ditampilkan hanya kepada pemilik akun dan konsisten dengan data sumber. |
| FR-PROFILE-03 | Open | Definisi aktivitas yang menambah streak, zona waktu, batas pergantian hari, dan aturan ketika satu hari terlewat perlu ditetapkan sebelum streak diimplementasikan. |
| FR-PROFILE-04 | Open | Sumber angka `total dokumen` perlu dipastikan apakah dihitung dari dokumen yang diunggah atau hanya dokumen yang berhasil diproses. |

### 6.5 Pengaturan dan Bantuan

Ekspor UI memperlihatkan pengaturan tema, ukuran teks, bahasa, notifikasi pengingat tugas, notifikasi streak, FAQ, laporan bug, dan feedback. Fitur-fitur ini perlu diperlakukan sebagai bagian dari rancangan layar, tetapi perilaku dan prioritas fungsionalnya belum seluruhnya didefinisikan.

| ID | Prioritas | Kebutuhan dan kriteria penerimaan |
|---|---|---|
| FR-SET-01 | Must | Implementasi halaman pengaturan dan bantuan mengikuti struktur layar Figma yang tersedia. |
| FR-SET-02 | Open | Pilihan tema, ukuran teks, bahasa, pengingat, waktu/jadwal notifikasi, FAQ, tujuan laporan bug, dan alur feedback harus ditetapkan oleh tim sebelum perilaku tersebut dibangun. |

### 6.6 Aksesibilitas dan Interaksi Suara

| ID | Prioritas | Kebutuhan dan kriteria penerimaan |
|---|---|---|
| FR-ACC-01 | Must | Navigasi dan tindakan utama dapat digunakan dengan keyboard, memiliki label yang dapat dibaca teknologi bantu, dan menunjukkan fokus yang terlihat. |
| FR-ACC-02 | Must | Antarmuka dapat dibaca pada layar kecil dan tidak bergantung pada drag-and-drop saja untuk memindahkan tugas. |
| FR-ACC-03 | Must | Sediakan voice input pada input yang sesuai dan text-to-speech untuk respons materi, mengikuti kontrol pada desain. Jika browser tidak mendukung fitur, tampilkan keadaan fallback tanpa memblokir input/output teks. |

## 7. Aturan Bisnis dan Batas Sistem

1. Hanya format `.pdf` yang diterima; ukuran maksimal 5 MB per berkas.
2. Maksimal 20 halaman pertama diproses. Perilaku saat dokumen memiliki halaman tambahan perlu dijelaskan kepada pengguna.
3. Chunking menggunakan target sekitar 500 token dengan overlap sekitar 50 token.
4. Retrieval mengambil paling banyak lima chunk untuk satu pertanyaan.
5. Respons ringkasan atau chat memiliki target di bawah 10 detik setelah pengguna memulai aksi. Cara pengukuran, perangkat, kondisi cold start, dan persentil target belum ditetapkan.
6. Model chat pengembangan: Ollama `qwen 3.6`. Model embedding: Ollama `nomic-embed-text`.
7. Tidak ada dukungan offline.
8. Pengguna hanya boleh melihat dan mengubah data yang terkait akunnya.

## 8. Kebutuhan Nonfungsional

### 8.1 Keamanan dan Privasi

- Semua tabel yang menyimpan data pengguna memakai RLS berbasis `auth.uid()`.
- Kepemilikan `document_chunks` dan `chat_messages` harus dapat diturunkan dan diverifikasi melalui dokumen serta `user_id` yang benar.
- FastAPI harus mengautentikasi pemanggil dan memverifikasi akses terhadap dokumen sebelum menerima pertanyaan, membaca riwayat, atau menyimpan hasil. `SUPABASE_SERVICE_ROLE_KEY` tidak menggantikan pemeriksaan otorisasi pengguna.
- Berkas PDF disimpan di Supabase Storage dengan path/izin yang membatasi akses ke pemiliknya. Berkas dan isi PDF diperlakukan sebagai data pengguna.
- Rahasia server, termasuk `OLLAMA_HOST` dan service role key, tidak pernah dikirim ke browser atau disertakan dalam prompt AI pihak luar.
- Isi PDF dianggap data yang tidak tepercaya. Instruksi di dalam dokumen tidak boleh mengubah kebijakan sistem atau meminta model mengungkap data di luar konteks dokumen.
- Proyek tidak mendefinisikan masa retensi, mekanisme penghapusan permanen, atau pemberitahuan privasi. Tim perlu menyepakatinya sebelum penggunaan nyata.

### 8.2 Performa

- Target respons AI kurang dari 10 detik dari aksi pengguna hingga hasil tampil.
- Frontend memberi umpan balik segera selama pekerjaan asinkron.
- Definisi metrik performa dan lingkungan ukur harus dicatat sebelum mengklaim target tercapai.

### 8.3 Usability dan Aksesibilitas

- Antarmuka mengikuti desain Figma dan mengurangi kebutuhan pengguna mengingat langkah atau informasi.
- Tombol utama menggunakan warna brand `#2563EB`; token lain mengikuti `docs/panduan/UI_DESIGN_REFERENCE.md` dan tema di web.
- Voice input dan text-to-speech disediakan sesuai dukungan browser dan tidak menggantikan penggunaan teks.
- Warna bukan satu-satunya pembeda status; fokus, status selesai, loading, dan error harus dapat dikenali dengan cara lain.

### 8.4 Responsivitas dan Kompatibilitas

- Aplikasi berbasis web untuk Chrome, Firefox, Safari, dan Edge versi terbaru.
- Desktop/tablet dengan lebar minimal 1024 px menjadi target optimal untuk Matriks empat kuadran.
- Di bawah 768 px, rancangan awal menetapkan kuadran tersusun vertikal dan pemindahan tugas melalui tap.
- Rentang 768–1023 px dan detail desain mobile perlu dikonfirmasi terhadap Figma sebelum UI final ditetapkan.

### 8.5 Keandalan dan Pemeliharaan

- Kegagalan jaringan, autentikasi, database, penyimpanan, atau model AI ditampilkan dengan pesan yang sesuai; error tidak ditelan diam-diam.
- Perubahan matriks menggunakan optimistic UI dengan rollback jika penyimpanan gagal.
- Validasi form frontend menggunakan Zod dan react-hook-form; endpoint FastAPI menggunakan Pydantic.
- Ikuti batas file, TypeScript, Python, styling, komponen, dan ukuran kode pada `docs/panduan/.cursorrules`.

## 9. Data Konseptual

Skema berikut adalah kebutuhan konseptual, bukan migrasi SQL final. Kolom detail, indeks, retensi, dan cascade delete harus disepakati saat SDD dibuat.

| Entitas | Isi dan relasi utama |
|---|---|
| `users_profile` | `user_id` terkait ke Supabase Auth, email, statistik profil, dan streak. Definisi streak masih terbuka. |
| `tasks` | `task_id`, `user_id`, judul, urgensi, kepentingan, kuadran, status selesai, posisi, serta waktu pembuatan/perubahan. Kolom yang belum disetujui harus dikonfirmasi saat desain skema. |
| `documents` | `doc_id`, `user_id`, nama file, path Storage, jumlah halaman, status pemrosesan, dan waktu pembuatan. |
| `document_chunks` | `chunk_id`, `doc_id`, urutan, teks, embedding pgvector, dan metadata yang diperlukan untuk retrieval. Kepemilikan diturunkan dari dokumen. |
| `chat_messages` | `message_id`, `doc_id`, `user_id`, role user/assistant, konten, urutan/waktu, dan relasi ke dokumen. |

## 10. Arsitektur dan Antarmuka

| Bagian | Tanggung jawab |
|---|---|
| Web | Next.js, TypeScript, Tailwind CSS v4, shadcn/ui Base UI. Mengelola layar, autentikasi, validasi input, dan CRUD umum melalui Supabase SSR. |
| Database/Auth/Storage | Supabase PostgreSQL, Supabase Auth, Storage, RLS, dan ekstensi pgvector. |
| AI API | FastAPI/Python dengan PyMuPDF dan Pydantic. Menangani ekstraksi PDF, chunking, embedding, retrieval, dan permintaan Ollama. |
| LLM lokal | Ollama menyediakan `qwen 3.6` untuk chat dan `nomic-embed-text` untuk embedding. |

Operasi CRUD umum tugas/profil dilakukan dari frontend ke Supabase. Operasi komputasi dokumen dan AI dilakukan lewat FastAPI. Kontrak endpoint, autentikasi token antar layanan, format error bersama, dan batas retry harus dibuat sebagai rancangan teknis sebelum implementasi.

## 11. Pengukuran Keberhasilan

### 11.1 Metrik Produk yang Sudah Diminta

- Jumlah aktivitas belajar.
- Jumlah dokumen yang diproses.
- Jumlah percakapan Ruang Paham.
- Streak belajar harian.
- Waktu respons AI dengan target di bawah 10 detik.

### 11.2 Metrik yang Disarankan untuk Diputuskan

- Persentase unggah PDF yang selesai diproses tanpa error.
- Persentase pertanyaan RAG yang dinilai pengguna relevan dengan isi dokumen.
- Persentase perubahan tugas yang berhasil tersimpan setelah drag-and-drop.
- Tingkat penyelesaian alur masuk, membuat tugas, dan mengajukan pertanyaan.

Metrik usulan di atas belum menjadi target rilis sampai definisi, cara pengumpulan, dan ambang keberhasilannya disetujui tim.

## 12. Kriteria Penerimaan MVP

MVP dapat dipertimbangkan siap demo ketika:

1. Pengguna dapat mengakses akun dan hanya melihat datanya sendiri.
2. Tugas dapat dibuat, ditempatkan dalam empat kuadran, dipindahkan, dan ditandai selesai; kegagalan penyimpanan tidak membuat UI dan database berbeda tanpa pemberitahuan.
3. PDF yang memenuhi batas dapat diproses, diringkas, dan digunakan untuk bertanya melalui pipeline RAG.
4. Jawaban berbasis dokumen; bila tidak ada bukti yang cukup, aplikasi menyatakan keterbatasan tersebut.
5. Profil menampilkan statistik dengan definisi yang disetujui dan sumber data yang konsisten.
6. Layar dan state yang sudah dirancang mengikuti ekspor Figma; loading, kosong, dan error ditangani tanpa menyimpang dari arah visual.
7. Kebijakan RLS, otorisasi API AI, batas unggah, serta skenario isolasi dua akun telah ditinjau.
8. Dokumentasi, batasan yang diketahui, dan hasil pemeriksaan yang benar-benar dijalankan tersedia untuk tim.

## 13. Ketergantungan dan Risiko

- Project Supabase, pgvector, Storage, schema, dan RLS belum disiapkan menurut status proyek terakhir.
- Ollama beserta kedua model perlu tersedia di lingkungan pengembangan.
- Performa lokal bergantung pada perangkat dan waktu pemanasan model; target 10 detik perlu diuji pada lingkungan yang ditetapkan.
- Akses langsung ke file Figma meminta kata sandi; pengembangan menggunakan ekspor layar PNG yang diberikan tim.
- Ekspor yang tersedia berfokus pada layar yang ada di paket PNG. Desain responsif, state interaksi, dan aturan beberapa kontrol mungkin belum seluruhnya tercakup.
- Definisi streak, reminder, penghapusan dokumen, format ringkasan, dan sumber jawaban masih dapat mengubah skema atau desain. Putuskan sebelum membangun bagian terkait.

## 14. Keputusan Terbuka untuk Review Tim

| Keputusan | Mengapa perlu dipastikan | Pemilik keputusan yang disarankan |
|---|---|---|
| Metode login, verifikasi, dan pemulihan akun | Menentukan layar, alur Auth, dan pengujian. | Calvin dan tim |
| Apakah kuadran hasil klasifikasi dapat diubah manual dan bagaimana atribut urgensi/kepentingan diselaraskan setelah dipindah | Mencegah inkonsistensi antara posisi kartu dan nilai klasifikasi. | Calvin, Krisna, Alda |
| Apakah task dapat diedit/dihapus dan apakah ada tenggat/penjadwalan | Menentukan skema tugas dan reminder. | Tim produk |
| Rumus streak, zona waktu, dan aktivitas pemicu | Menentukan statistik profil yang bermakna. | Alda dan tim |
| Panjang/format ringkasan, citation/sumber jawaban, dan fallback retrieval kosong | Menentukan pengalaman Ruang Paham serta schema respons AI. | Andi, Krisna, Alda |
| Batas jumlah dokumen, pemrosesan ulang, penghapusan, dan retensi | Menentukan kebijakan Storage, database, privasi, dan biaya lokal. | Calvin dan tim |
| Perilaku tema, bahasa, ukuran teks, reminder, FAQ, laporan bug, dan feedback | Layar sudah terlihat di ekspor, tetapi spesifikasi perilakunya belum lengkap. | Krisna dan tim |
| Arti target AI `<10 detik` dan kondisi pengukurannya | Menentukan cara evaluasi performa yang dapat diulang. | Andi dan Alda |
| Desain/interaksi ukuran layar mobile dan tablet | Ekspor saat ini tidak cukup untuk menetapkan seluruh variasi responsif. | Krisna dan tim |

## 15. Roadmap yang Tercatat

| Fase | Fokus | Hasil utama |
|---|---|---|
| Persiapan | Finalisasi schema/RLS, Supabase, pgvector, Storage, Ollama, kontrak teknis, dan keputusan terbuka yang menjadi dependensi. | Lingkungan dan keputusan dasar siap dipakai tim. |
| Sprint 1 — Minggu VII | Auth & Login. | Sesi dan halaman terlindungi mengikuti Figma; data terisolasi. |
| Sprint 2 — Minggu X | Matriks Eisenhower dan Ruang Paham RAG. | Alur tugas dan PDF/chat berfungsi sesuai kebutuhan serta desain. |
| Sprint 3 — Minggu XIII | Profil, aksesibilitas, QA, dan User Manual. | Statistik, perbaikan kualitas, dokumentasi, dan kesiapan demo. |

Jadwal yang tersedia menggunakan nomor minggu perkuliahan; tanggal kalender belum ditetapkan.

## 16. Riwayat Perubahan Utama

- Kuis AI dihapus dari scope.
- Ruang Paham ditetapkan sebagai RAG chatbot, bukan sekadar personalisasi penjelasan.
- Provider chat dan embedding ditetapkan ke Ollama lokal.
- Desain Figma yang sudah ada dijadikan sumber acuan visual wajib untuk implementasi web.
