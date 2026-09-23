# Acuan UI/UX PahaMIn

## Status

Desain UI/UX PahaMIn sudah tersedia di Figma dan layar-layar utamanya telah diekspor sebagai PNG. File Figma pada tautan yang diberikan meminta kata sandi, sehingga ekspor PNG yang diberikan pengguna menjadi referensi yang dapat diakses di dalam repositori.

## Lokasi Referensi

- Ekspor layar: `docs/design-reference/figma-exports/`
- Sumber kiriman: `PahamIn (1).zip`
- Contoh cakupan layar: landing page, autentikasi, Matriks Tugas, Ruang Paham, profil, pengaturan, dan bantuan.

## Aturan Implementasi

1. Gunakan ekspor Figma sebagai acuan visual sebelum membuat atau mengubah halaman.
2. Jangan membuat UI dari awal atau mengganti rancangan yang sudah disetujui.
3. Pertahankan komposisi layout, warna, tipografi, ukuran/ruang, ikon, bentuk komponen, serta pola interaksi semirip mungkin dengan acuan.
4. Implementasikan tampilan dengan komponen Next.js dan styling proyek. Jangan menjadikan PNG screenshot sebagai latar atau pengganti halaman yang berfungsi.
5. Penyesuaian hanya dilakukan bila diperlukan untuk membuat desain bekerja pada ukuran web, aksesibilitas, atau integrasi data. Jaga perubahan visual seminimal mungkin.
6. Jika halaman, kondisi, atau interaksi yang dibutuhkan tidak tergambar, periksa semua layar dan spesifikasi proyek. Tanyakan kepada pengguna sebelum menambahkan keputusan visual yang substantif.

## Catatan Implementasi

Frontend saat ini masih berupa scaffolding dengan landing page sementara. Halaman berikutnya harus dibangun dengan mencocokkan ekspor yang relevan, bukan memperluas placeholder menjadi desain baru. Periksa keadaan kosong, loading, error, dan layar kecil tanpa menyimpang dari pola desain yang tersedia.
