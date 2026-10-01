# Saran Sebelum Pengembangan PahaMIn

Dokumen ini merangkum persiapan yang disarankan sebelum tim mulai membangun fitur web app. Tujuannya agar keputusan fondasi tidak berubah di tengah implementasi dan pekerjaan tiap anggota memiliki kriteria selesai yang jelas.

## 1. Selesaikan Keputusan Fondasi Produk

Sepakati terlebih dahulu keputusan yang memengaruhi database, keamanan, dan alur utama:

- Metode login, verifikasi akun, dan pemulihan kata sandi.
- Data wajib pada tugas, aturan pengelompokan kuadran, serta apakah tugas dapat diedit, dijadwalkan, dihapus, atau ditandai selesai.
- Kepemilikan dokumen, batas jumlah dokumen, penghapusan, dan masa retensi.
- Bentuk ringkasan dan jawaban Ruang Paham, penyertaan sumber, serta respons saat dokumen tidak memuat jawaban.
- Definisi streak, zona waktu, dan aktivitas yang menambah streak.

Daftar keputusan yang masih terbuka ada di [PRD](project-requirements.md). Fitur seperti FAQ, bahasa, dan pengaturan tambahan dapat diputuskan kemudian bila tidak menghalangi alur MVP.

## 2. Siapkan Supabase dan Kontrak Backend

Sebelum membangun fitur yang menyimpan data:

- Tetapkan schema database dan siapkan migrasi yang dapat ditinjau serta dijalankan ulang.
- Siapkan Supabase Auth, tabel, Storage, ekstensi pgvector, dan indeks vektor yang diperlukan.
- Aktifkan dan tinjau RLS untuk semua data pengguna. Batasi akses berdasarkan `auth.uid()`.
- Tetapkan cara FastAPI memverifikasi identitas pengguna dan memeriksa kepemilikan dokumen.
- Uji isolasi memakai dua akun: masing-masing akun hanya dapat melihat dan mengubah datanya sendiri.
- Simpan `SUPABASE_SERVICE_ROLE_KEY` dan seluruh secret lain hanya di server. Service role key tidak menggantikan pemeriksaan otorisasi pengguna.

Kontrak endpoint, format request/response, error, dan autentikasi antarlayanan sebaiknya disepakati sebelum frontend dan backend mengimplementasikan alur yang sama.

## 3. Siapkan Lingkungan Kerja Tim

- Pastikan setiap anggota dapat menjalankan frontend dari folder `web`.
- Pastikan lingkungan Python API dapat dibuat dan dependency dari `api/requirements.txt` dapat dipasang.
- Siapkan project Supabase dan buat konfigurasi lokal masing-masing berdasarkan file `.env.example`.
- Siapkan Ollama dan model yang disepakati untuk chat serta embedding.
- Pastikan endpoint backend `/health` dapat diakses secara lokal.
- Jangan commit `.env`, password, token, atau key rahasia.

Sebelum mengerjakan fitur, setiap anggota sebaiknya mengonfirmasi bahwa lingkungan lokalnya berjalan dan memahami cara menjaga perubahan lokal saat bekerja bersama.

## 4. Tinjau Dependency Sebelum Deployment

Audit menemukan Next.js `16.3.5` termasuk dalam rentang terdampak advisory kritis untuk kondisi tertentu pada `next/og` `ImageResponse`. Jalur penggunaan fitur rentan tersebut tidak ditemukan pada kode saat audit. Perbarui Next.js ke versi yang sudah ditambal sebelum deployment, dan sesuaikan `eslint-config-next`.

Audit dependency lengkap masih perlu diulang. Pemeriksaan npm tidak dapat menjangkau registry pada audit sebelumnya dan versi dependency Python yang terpasang tidak dapat diinventarisasi dari lingkungan lokal. Rincian temuan dan batas verifikasi ada di [TODO hasil audit](todo.md).

## 5. Bagi Pengembangan Menjadi Milestone Kecil

Urutan implementasi yang disarankan:

1. Autentikasi dan perlindungan data per pengguna.
2. Matriks Tugas: membuat, mengubah, memindahkan, menyelesaikan, dan menghapus tugas sesuai keputusan produk.
3. Ruang Paham: unggah dokumen, pemrosesan PDF, retrieval, chat, dan riwayat percakapan.
4. Profil, statistik, aksesibilitas, QA, dan dokumentasi pengguna.

Untuk setiap milestone, tentukan satu penanggung jawab, batas lingkup, kriteria penerimaan, dan bukti hasil. Hindari beberapa anggota mengubah file inti yang sama secara bersamaan.

## 6. Lengkapi Acuan Implementasi UI

Desain Figma yang telah dibuat tetap menjadi acuan visual utama. Sebelum membangun layar:

- Cocokkan ekspor Figma dengan layar dan interaksi yang akan dikerjakan.
- Catat perilaku mobile dan tablet yang belum terwakili oleh ekspor.
- Tentukan tampilan loading, kosong, error, sukses, dan kondisi offline sesuai arah desain yang ada.
- Klarifikasi detail visual yang belum tercakup sebelum membuat perubahan visual yang substantif.
- Implementasikan UI dengan komponen web; jangan menggunakan screenshot sebagai pengganti antarmuka.

Gunakan [panduan UI/UX](panduan/UI_DESIGN_REFERENCE.md), [ekspor layar Figma](design-reference/figma-exports/), dan [design brief](design-brief.md) sebagai referensi.

## 7. Siapkan Kriteria QA Sejak Awal

Tambahkan skenario penerimaan untuk setiap milestone. Skenario awal yang disarankan:

- Dua akun tidak dapat mengakses data satu sama lain.
- Sesi berakhir dan akses ke halaman privat ditangani dengan benar.
- Kegagalan penyimpanan tugas mengembalikan UI ke keadaan yang konsisten dan memberi tahu pengguna.
- PDF yang melewati batas ukuran atau jumlah halaman ditolak dengan pesan yang jelas.
- Pertanyaan yang tidak didukung isi dokumen mendapat respons keterbatasan, bukan jawaban yang diklaim bersumber.
- Loading, error, dan kegagalan jaringan terlihat serta dapat dipulihkan.
- Target respons AI di bawah 10 detik diukur pada perangkat dan kondisi yang disepakati.

## Rekomendasi Mulai

Tim dapat mulai setelah keputusan fondasi dan lingkungan Supabase siap; seluruh detail produk tidak harus diselesaikan sekaligus. Mulailah dengan alur vertikal autentikasi, pembuatan tugas, dan verifikasi isolasi data pemilik. Setelah alur tersebut stabil, lanjutkan ke Matriks Tugas dan Ruang Paham.
