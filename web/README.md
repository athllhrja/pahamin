# Frontend PahaMIn

Frontend PahaMIn menggunakan Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, dan Supabase SSR. Panduan proyek utama ada di [`../README.md`](../README.md).

## Menjalankan Secara Lokal

Pasang dependency dari folder `web`:

```bash
npm ci
```

Buat berkas `.env.local` di folder ini dan isi URL serta public anon key dari project Supabase:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Jalankan server pengembangan:

```bash
npm run dev
```

Buka `http://localhost:3000`. Untuk perintah build dan pemeriksaan lint, jalankan `npm run build` atau `npm run lint` dari folder `web`.

## Acuan UI/UX

Sebelum membuat atau mengubah halaman, baca [`../docs/panduan/UI_DESIGN_REFERENCE.md`](../docs/panduan/UI_DESIGN_REFERENCE.md) dan lihat ekspor layar di [`../docs/design-reference/figma-exports/`](../docs/design-reference/figma-exports/). Pertahankan desain Figma sebagai acuan visual; implementasikan layar dengan komponen web, bukan screenshot.

Aturan coding dan arsitektur lengkap ada di [`../docs/panduan/.cursorrules`](../docs/panduan/.cursorrules); `.cursorrules` di root menunjuk ke sana. Frontend masih berupa scaffolding dan landing page sementara; halaman produk belum selesai.
