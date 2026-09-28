# TODO PahaMIn — Hasil Audit

Dokumen ini menggabungkan hasil audit keamanan pre-launch dan audit cleanup Fase 1. Audit cleanup hanya membaca repository; tidak ada kode atau dependency yang dihapus. Perubahan cleanup hanya boleh dilakukan setelah itemnya disetujui.

Tanggal audit: 28 September 2026

## Prioritas keamanan

| Prioritas | Status | Temuan dan bukti | Tindakan yang disarankan |
|---|---|---|---|
| Critical | Terbuka | `web/package.json` dan `web/package-lock.json` mengunci Next.js `16.3.5`, yang termasuk rentang terdampak advisory RCE pada `next/og` `ImageResponse`. Eksploitasi membutuhkan penggunaan Node.js `ImageResponse` dengan nilai tak tepercaya dalam SVG, atribut, atau style. Penggunaan `next/og` belum ditemukan pada kode saat audit. [Advisory Next.js GHSA-vcvr-r3jv-pc5j](https://github.com/vercel/next.js/security/advisories/GHSA-vcvr-r3jv-pc5j) | Perbarui `next` ke `16.3.6` atau versi lebih baru yang telah ditambal; sesuaikan `eslint-config-next`, lalu verifikasi dependency dan build sebelum deploy. |
| Medium | Terbuka sebelum route privat dibuat | `web/proxy.ts` memanggil `supabase.auth.getUser()` tetapi hasilnya tidak digunakan untuk membatasi akses. Saat audit, route privat dan endpoint data pengguna belum ditemukan. | Lindungi route privat berdasarkan hasil autentikasi. Periksa autentikasi dan hak akses lagi pada setiap Server Action, route handler, serta operasi data; jangan mengandalkan proxy saja. |
| Low | Terbuka sebelum peluncuran | `web/next.config.ts` belum menetapkan security headers. | Tambahkan kebijakan CSP yang sesuai, `X-Content-Type-Options: nosniff`, dan `Referrer-Policy`. Tambahkan HSTS hanya pada deployment HTTPS dan uji kompatibilitas header. |

## Persiapan keamanan sebelum fitur diluncurkan

- [ ] **Otorisasi dan IDOR:** aktifkan RLS pada tabel, batasi akses dengan `auth.uid()`, dan pastikan backend memverifikasi kepemilikan dokumen sebelum membaca, mengubah, atau menghapusnya. Belum ada endpoint data untuk menguji akses user A terhadap data user B.
- [ ] **Autentikasi dan session:** saat alur login dibangun, periksa redirect untuk pengguna tanpa sesi serta otorisasi pada tiap akses data. Cookie aktual belum dapat diverifikasi karena belum ada alur login aktif.
- [ ] **Rate limiting:** atur perlindungan Supabase Auth untuk alur login/reset akun. Tambahkan pembatasan berdasarkan IP/pengguna, ukuran request, dan timeout sebelum route chat atau upload PDF dibuka.
- [ ] **CORS produksi:** saat ini origin dibatasi ke `http://localhost:3000` di `api/main.py`. Ganti dengan origin frontend produksi yang tepat; jangan memakai wildcard origin bersama credentials.
- [ ] **Dependency audit lengkap:** ulangi audit npm ketika registry dapat diakses dan periksa versi dependency Python yang benar-benar terpasang. `npm audit` gagal menghubungi endpoint registry saat audit; lingkungan Python lokal juga tidak dapat dijalankan untuk menginventarisasi versi terpasang.
- [ ] **Reproducibility dependency API:** tinjau penggunaan lockfile atau pin versi untuk dependency API karena `api/requirements.txt` menggunakan rentang versi.

## Kategori yang bersih pada kode saat audit

- Tidak ditemukan secret dengan nilai nyata yang tertanam atau file `.env` terlacak. `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` memang digunakan di browser; keduanya bukan secret. Jangan pernah mengirim `SUPABASE_SERVICE_ROLE_KEY` atau `OLLAMA_HOST` ke client.
- Tidak ditemukan SQL/NoSQL injection, command injection, XSS berbasis HTML mentah, atau pemanggilan shell pada kode aplikasi yang diperiksa.
- Belum ada endpoint input pengguna; route API yang tersedia hanya `GET /health` dan mengembalikan status tetap. Karena itu, validasi input belum memiliki jalur aktif untuk dieksploitasi.
- CORS saat ini tidak menerima origin sembarang; hanya metode dan header yang wildcard.
- Tidak ditemukan log token, secret, atau data pengguna, dan tidak ditemukan informasi sensitif pada error response.
- Belum ada endpoint autentikasi atau API produk yang bisa menjadi sasaran brute force. Endpoint health bersifat publik dan hanya mengembalikan informasi layanan statis.

## Kandidat cleanup Fase 1

Confidence menyatakan keyakinan bahwa item belum dipakai oleh implementasi saat ini. Risiko menyatakan dampak jika item dihapus. Confidence bahwa sesuatu belum digunakan **bukan** persetujuan untuk menghapusnya.

| ID | Kandidat dan bukti | Confidence belum dipakai | Risiko penghapusan | Keputusan audit |
|---|---|---:|---|---|
| A1 | Komponen UI tanpa import dari halaman aktif: `web/components/ui/alert-dialog.tsx`, `alert.tsx`, `badge.tsx`, `dialog.tsx`, `input.tsx`, `label.tsx`, `select.tsx`, `separator.tsx`, `skeleton.tsx`, `table.tsx`, `tabs.tsx`, `textarea.tsx`, dan `tooltip.tsx`. Saat ini halaman memakai `button.tsx`, `card.tsx`, dan `sonner.tsx`. | 100% | Sedang; layar Figma mendatang dapat membutuhkannya. | Jangan hapus sebelum kebutuhan layar yang akan dibangun dikonfirmasi. |
| A2 | Helper Supabase belum diimpor: `web/lib/supabase/client.ts` dan `web/lib/supabase/server.ts`. Proxy saat ini membuat kliennya sendiri. | 100% | Tinggi; fondasi untuk autentikasi dan akses Supabase mendatang. | Pertahankan. |
| A3 | `web/lib/utils.ts` belum dipakai langsung, tetapi menjadi target alias `utils` pada `web/components.json`. | 100% | Sedang; dapat dibutuhkan oleh workflow shadcn. | Jangan hapus sebelum workflow generator komponen dipastikan. |
| A4 | Export `CardAction` dan `CardFooter` di `web/components/ui/card.tsx` belum digunakan di luar modul. | 100% | Sedang; dapat dipakai oleh layout kartu mendatang. | Kandidat untuk ditinjau setelah desain layar diimplementasikan. |
| A5 | Dependency belum diimpor kode aktif: `@hello-pangea/dnd`, `@hookform/resolvers`, `react-hook-form`, `zod`, dan `zustand`. | 100% | Tinggi; disiapkan untuk drag-and-drop, validasi formulir, dan state global. | Pertahankan untuk fitur yang direncanakan. |
| A6 | Variabel API pada `api/.env.example` belum dibaca oleh API saat ini: `OLLAMA_HOST`, `OLLAMA_CHAT_MODEL`, `OLLAMA_EMBED_MODEL`, `SUPABASE_URL`, dan `SUPABASE_SERVICE_ROLE_KEY`. | 100% | Tinggi; direncanakan untuk backend AI dan Supabase. | Pertahankan; service role key harus tetap rahasia server. |
| A7 | `clsx` dan `tailwind-merge` belum diimpor langsung. Kode menggunakan paket `cn`, yang dideskripsikan sebagai pengganti gabungan keduanya; aturan proyek juga menyebut kombinasi tersebut. | 95% belum diimpor langsung; 85% yakin aman dihapus | Rendah–sedang; keputusan dapat bertentangan dengan aturan coding yang berlaku. | Confidence aman hapus di bawah 90%; jangan hapus tanpa keputusan tim. |
| A8 | Paket `shadcn` tidak muncul pada scripts npm; `components.json` tersedia dan CLI mungkin dipakai secara manual. | 100% tidak dipakai oleh scripts; 75% yakin aman dihapus | Sedang; penghapusan dapat memutus penggunaan CLI manual. | Confidence aman hapus di bawah 90%; jangan hapus sebelum workflow dikonfirmasi. |

## Hasil pemeriksaan cleanup lainnya

- Tidak ditemukan blok kode executable yang di-comment out. Komentar konfigurasi/template dan penanda generated Next.js bukan blok kode mati.
- Tidak ditemukan import lokal, fungsi, atau variabel aplikasi yang jelas tidak dipakai. `buttonVariants` dipakai oleh komponen Button.
- Tidak ditemukan logic aplikasi yang terduplikasi dan layak diekstrak menjadi shared utility. Setup cookie di proxy dan helper server melayani konteks berbeda.
- Tidak ada file kode yang melewati 200 baris. File terpanjang adalah `web/components/ui/select.tsx` dengan 188 baris.
- Satu-satunya endpoint API adalah `GET /health` di `api/routers/health.py`. Tidak ditemukan pemanggil internal, tetapi endpoint dapat digunakan monitor deployment; pertahankan.
- Tautan Masuk dan Buat Akun pada `web/app/page.tsx` menuju `/login` dan `/register`, tetapi route tujuan belum tersedia. Ini pekerjaan implementasi mendatang, bukan route mati untuk dihapus.

## Batas audit

Audit cleanup adalah pemeriksaan statis dan tidak mengubah repository. Pemeriksaan dependency penuh belum berhasil karena registry npm tidak dapat dijangkau dan interpreter Python lokal tidak tersedia. Temuan security advisory Next.js berasal dari advisory upstream; jalur eksploitasi spesifiknya belum ditemukan digunakan oleh aplikasi saat audit.
