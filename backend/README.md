# Backend login dan tugas

Backend ini dijalankan melalui Next.js di folder `web`. FastAPI dan Ollama tidak diperlukan.

## Setup database

Pada project Supabase untuk tes, buka SQL Editor, buat query baru, lalu jalankan isi `supabase/migrations/202611180001_forms.sql` satu kali. Migrasi ini membuat tabel tugas, profil, fungsi pemeriksaan sesi, dan RLS. Migrasi dasar juga membuat tabel dan bucket dokumen; tidak mengaktifkan AI maupun endpoint unggah di web.

Jangan jalankan ulang migrasi ini jika tabel sudah tersedia. Periksa riwayat setup project terlebih dahulu. Migrasi `202611180002_upload_receipts.sql` hanya diperlukan saat fitur dokumen diaktifkan.

Buat dua akun tes di Supabase Authentication dengan email terkonfirmasi dan password minimal 8 karakter. Gunakan akun berbeda untuk menguji pembatasan data antar-pengguna.

## Menjalankan aplikasi

Isi `web/.env.local` dengan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` milik project tes. Gunakan public anon key, bukan service role key.

Dari `backend`, jalankan `npm.cmd ci`. Dari `web`, jalankan `npm.cmd ci`, kemudian `npm.cmd run dev`. Kedua folder memerlukan dependency karena route web mengimpor layanan backend.

## Kontrak untuk frontend

| Method | Endpoint | JSON body |
| --- | --- | --- |
| POST | `/api/auth/login` | `{"email":"akun@example.com","password":"password-akun-tes"}` |
| POST | `/api/auth/logout` | `{}` |
| GET | `/api/tasks` | Tidak ada |
| POST | `/api/tasks` | `{"judul":"Belajar","mendesak":false,"penting":true}` |

Panggil endpoint dari origin frontend yang sama memakai path relatif dan `Content-Type: application/json` untuk POST. Session disimpan melalui cookie HttpOnly. Gunakan endpoint ini untuk login dan akses tugas, bukan mencampurkannya dengan login Supabase client di browser. Request POST dari alat seperti Postman harus membawa header `Origin` yang sama dengan origin server; simpan cookie hasil login untuk request berikutnya.

Respons berhasil berisi `status`, `data`, dan `request_id`. Respons gagal berisi `status`, `code`, `message`, dan `request_id`. Status umum: 401 untuk sesi/kredensial tidak valid, 403 untuk origin tidak diizinkan, 422 untuk input tidak valid, dan 503 untuk layanan belum tersedia.

Render judul tugas sebagai teks React, jangan melalui `dangerouslySetInnerHTML`. Payload SQL atau HTML di judul harus diperlakukan sebagai data; menerima teks tersebut bukan bukti injection berhasil.

## Pemeriksaan

Dari `backend`, jalankan `npm.cmd test`. Saat Next.js aktif, jalankan `node tests/forms-http-smoke.mjs 3000` untuk memeriksa route nyata tanpa kredensial. Tes ini tidak menggantikan pengujian login berhasil, cookie sesi, dan isolasi dua akun di Supabase live.
