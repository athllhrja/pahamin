# PahaMIn: Asisten Produktivitas dan Belajar Mahasiswa

## 1. Deskripsi Produk

PahaMIn adalah aplikasi web asisten produktivitas dan belajar yang dikembangkan oleh tim INTERCORP (Telkom University Surabaya) khusus untuk mahasiswa. Aplikasi ini menyatukan dua pilar utama:

- **Manajemen prioritas tugas** dengan konsep Matriks Eisenhower (Matriks Tugas).
- **Asisten pemahaman materi perkuliahan** lewat pemrosesan dokumen PDF berbasis kecerdasan buatan, yaitu Retrieval-Augmented Generation atau RAG (Ruang Paham).

Sistem dirancang berjalan secara lokal (localhost) untuk keperluan tugas akademik dan demonstrasi pada perangkat laptop referensi, bukan deployment production. Pemrosesan AI berjalan lewat Ollama di laptop, sehingga isi dokumen tidak dikirim ke layanan AI pihak ketiga.

## 2. Latar Belakang dan Masalah yang Ingin Diselesaikan

Mahasiswa mengelola dua hal sekaligus: banyak tugas dengan urgensi berbeda, dan banyak materi berformat PDF (slide, modul, jurnal). Keduanya sering ditangani dengan alat terpisah dan tanpa struktur. Berdasarkan fungsi sistem, PahaMIn ditujukan untuk memecahkan dua masalah utama.

### a. Kesulitan prioritas tugas

Mahasiswa sering kewalahan membedakan tugas yang harus segera dikerjakan dan yang bisa ditunda. PahaMIn mengklasifikasikan tugas secara otomatis ke empat kuadran berdasarkan kombinasi status "mendesak" dan "penting":

| Mendesak | Penting | Kuadran |
|---|---|---|
| Ya | Ya | Lakukan |
| Tidak | Ya | Jadwalkan |
| Ya | Tidak | Delegasikan |
| Tidak | Tidak | Abaikan |

### b. Inefisiensi memahami materi teks panjang

Mencari informasi spesifik dalam dokumen akademik memakan banyak waktu. Melalui Ruang Paham, sistem memproses teks maksimal 20 halaman pertama per dokumen untuk menyajikan ringkasan dan jawaban atas pertanyaan pengguna tentang isi materi. Model dirancang agar tidak mengarang jawaban (halusinasi) dan harus menyatakan keterbatasan bila jawabannya tidak ada di dalam dokumen.

### Masalah turunan yang juga ditangani

| Masalah | Penanganan |
|---|---|
| Asisten AI umum dapat menjawab di luar materi | Jawaban dibatasi pada maksimal lima potongan paling relevan dari dokumen yang dipilih |
| Kekhawatiran privasi materi dan data | Pemrosesan AI lokal; setiap data hanya dapat diakses pemiliknya (RLS) |
| Sulit melacak kebiasaan belajar | Profil dengan statistik dan streak belajar |

## 3. Fitur Utama

### Akun dan sesi

Daftar dan masuk dengan email dan kata sandi, keluar, serta proteksi halaman.

### Matriks Tugas

- Buat tugas (judul, mendesak, penting), tandai selesai, ubah, dan hapus.
- Pindahkan tugas antar kuadran dengan drag-and-drop atau menu "Pindahkan ke…" yang juga bekerja di layar sentuh dan keyboard.
- Perubahan tampil langsung dan dipulihkan bila penyimpanan gagal.

### Ruang Paham

- Unggah PDF (maksimal 5 MB, 20 halaman pertama diproses, 10 dokumen per akun).
- Status pemrosesan terlihat (diproses, siap, gagal dengan penyebab yang jelas), plus daftar dokumen, hapus dokumen, dan proses ulang dokumen yang gagal.
- Ringkasan berupa paragraf dan poin kunci, tersimpan dan dapat dibuat ulang.
- Tanya jawab dengan nomor halaman sumber, dengan riwayat chat yang melekat pada setiap dokumen.

### Profil dan statistik

Jumlah dokumen siap, jumlah pertanyaan, dan streak (hari berurutan dengan minimal satu pertanyaan).

### Pengaturan dan bantuan

Tema dan ukuran teks (bahasa dan notifikasi bila waktu cukup), FAQ, serta pengiriman feedback atau laporan bug.

### Di luar lingkup

Generator kuis, login Google, dashboard admin, mode offline, dan deployment production. Tenggat tugas ditunda ke versi berikutnya.

## 4. Fitur Implementasi AI

1. **Ekstraksi teks.** PyMuPDF membaca hingga 20 halaman pertama. PDF rusak, terenkripsi, kosong, atau tanpa teks ditandai gagal secara terkontrol.
2. **Chunking.** Teks dipotong sekitar 500 token dengan overlap sekitar 50 token, di dalam batas halaman agar nomor halaman sumber akurat.
3. **Embedding.** Model `nomic-embed-text` (768 dimensi) lewat Ollama, disimpan di pgvector.
4. **Retrieval.** Pencarian kemiripan cosine pada satu dokumen, maksimal lima potongan, dengan ambang kemiripan (nilai awal 0,5, dikalibrasi lewat pengujian). Jika tidak ada potongan yang lolos, sistem menjawab "tidak ditemukan" tanpa memanggil model.
5. **Generasi jawaban.** Prompt membatasi model pada isi konteks dan mewajibkan kalimat baku bila jawaban tidak ada. Isi dokumen ditempatkan dalam delimiter sebagai data, bukan instruksi.
6. **Ringkasan.** Dokumen pendek diringkas sekali jalan, dokumen panjang memakai map-reduce. Keluaran berformat JSON (paragraf dan poin kunci) lalu divalidasi.

### Pengamanan AI

Pertahanan terhadap prompt injection (diuji dengan lima dokumen uji), sanitasi keluaran model, batas panjang pertanyaan 1000 karakter, dan pembatasan laju per pengguna.

### Catatan jujur

Model generasi belum ditetapkan. `qwen3.6` di Ollama berukuran 27B dan 35B sehingga tidak layak di laptop referensi (kemungkinan VRAM 4 GB), jadi perlu model yang jauh lebih kecil. Target respons median ≤ 10 detik baru bisa dipastikan setelah diukur di mesin demo.

## 5. Platform: Web, Desktop, dan Mobile

| Platform | Dukungan |
|---|---|
| **Web** | Platform utama: aplikasi Next.js di browser (target dua versi stabil terakhir Chrome, Edge, Firefox). |
| **Desktop** | Tidak ada aplikasi native. Pengguna desktop memakai aplikasi web di browser; backend AI dan Ollama berjalan di laptop pengembang. |
| **Mobile** | Tidak ada aplikasi native. Tampilan web responsif: di bawah 768 px matriks tersusun vertikal dan pemindahan tugas memakai kontrol sentuh. |

Karena demo hanya melalui **localhost**, tampilan mobile dapat diuji lewat mode responsif browser, tetapi ponsel tidak dapat mengakses aplikasi dari jaringan. Aplikasi juga tidak mendukung mode offline karena bergantung pada Supabase.

## 6. Tools dan Teknologi

| Kategori | Tools |
|---|---|
| Frontend | Next.js, React, TypeScript, Tailwind CSS v4, shadcn/ui, Zod, react-hook-form |
| Autentikasi dan sesi | Supabase Auth, Supabase SSR |
| Database dan penyimpanan | Supabase PostgreSQL, pgvector, Supabase Storage, `pg_cron` |
| Keamanan data | Row Level Security dan kebijakan bucket |
| Backend AI | FastAPI (Python), Uvicorn, Pydantic |
| Pemrosesan PDF | PyMuPDF, `tiktoken` (pendekatan penghitung token) |
| AI lokal | Ollama; embedding `nomic-embed-text`; model generasi menunggu uji kelayakan |
| Desain dan dokumentasi | Figma (UI/UX), Mermaid (diagram), Markdown |
| Pengujian dan keamanan | `npm audit`, `pip-audit`, `nmap`, `curl`, pemindaian rahasia pada repositori |
| Perangkat demo | Lenovo IdeaPad Gaming 3 15ACH6 (Ryzen 5 5600H) |

## Penyesuaian dari teks Anda

- Saya mengganti "jawaban instan" menjadi "jawaban". Target di SKPL adalah median ≤ 10 detik, jadi kata "instan" bisa dipertanyakan penguji.
- Saya menulis "dirancang agar tidak mengarang", bukan "dilarang mengarang". Itu sebuah mekanisme (ambang kemiripan dan instruksi prompt) yang diuji dengan kriteria minimal 9 dari 10 pertanyaan di luar materi. Itu bukan jaminan mutlak.
- Saya menambahkan "pertama" pada "20 halaman", karena yang diproses adalah 20 halaman pertama.

Kalau perlu, saya bisa simpan teks gabungan ini sebagai file Markdown atau Word.
