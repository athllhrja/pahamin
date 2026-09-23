# Panduan Menggunakan Prompt AI PahaMIn

Folder ini berisi prompt peran yang sudah disusun untuk tugas-tugas proyek PahaMIn. Sebelum meminta bantuan AI, setiap anggota tim perlu memilih prompt yang sesuai, memberi konteks tugas yang cukup, dan menyebutkan hasil yang diharapkan. Prompt peran membantu mengarahkan cara kerja AI; prompt tersebut tidak menggantikan keputusan tim, `.cursorrules`, spesifikasi, atau pemeriksaan hasil.

## Langkah Sebelum Mengirim Prompt

### 1. Tentukan hasil yang Anda butuhkan

Nyatakan apakah Anda meminta rencana kerja, rancangan teknis, implementasi kode, test case, review kode, perbaikan bug, rancangan prompt untuk LLM, atau dokumentasi. Jangan meminta semua jenis pekerjaan sekaligus dalam satu prompt bila keluaran dan PIC-nya berbeda.

### 2. Baca konteks proyek yang relevan

Sebelum meminta AI mengubah proyek, baca:

- `.cursorrules` untuk aturan wajib coding dan arsitektur.
- `docs/CONTEKST_PROYEK3.md` untuk status, scope, dan keputusan terakhir.
- `docs/project-requirements.md` untuk kebutuhan produk.
- `docs/UI_DESIGN_REFERENCE.md` dan ekspor di `docs/design-reference/figma-exports/` jika tugas menyentuh UI.
- Prompt peran yang paling sesuai dari tabel berikut.

Jika AI yang digunakan bisa membaca repository, berikan path berkas dan minta AI membacanya. Jika AI tidak bisa membuka repository, salin isi prompt peran dan cuplikan konteks yang relevan ke percakapan. Jangan hanya menyebut nama file yang tidak bisa diakses AI.

### 3. Pilih prompt peran yang sesuai

| Berkas | Gunakan untuk | Batas peran |
|---|---|---|
| `task-breakdown.md` | Memecah target sprint/fitur menjadi micro-task berurutan, PIC, file target, dan Definition of Done. | Perencanaan saja; prompt ini tidak meminta AI menulis kode. |
| `api-designer.md` | Merancang tabel, relasi, kebijakan RLS, kontrak API, dan alur data sebelum implementasi backend. | Blueprint saja; bukan implementasi kode. |
| `ai-optimizer.md` | Merancang system prompt/user prompt bagi Ollama untuk ringkasan atau jawaban RAG. | Menghasilkan instruksi untuk model aplikasi; bukan prompt kerja umum bagi coding agent. |
| `qa-tester.md` | Menyusun skenario uji positif, negatif, batas, dan keamanan bagi fitur yang sudah dibuat. | Merancang test case; jangan menyatakan fitur lulus sebelum pengujian benar-benar dijalankan. |
| `quality-checker.md` | Mereview perubahan kode terhadap standar PahaMIn dan menemukan pelanggaran. | Review saja; gunakan prompt implementasi terpisah jika ingin AI memperbaiki kode. |
| `the-fixer.md` | Mendiagnosis dan memperbaiki bug tertentu menggunakan log/error yang tersedia. | Perbaikan terisolasi; sertakan stack trace atau langkah reproduksi yang spesifik. |
| `the-documenter.md` | Mendokumentasikan fitur, komponen, endpoint, atau kode yang sudah benar-benar diimplementasikan. | Dokumentasi faktual; jangan meminta spesifikasi yang belum ada dianggap sudah berjalan. |
| `handoff-scaffolding.md` | Memberi konteks proyek saat memulai sesi/agent baru. | Handoff konteks; bukan prompt untuk satu fitur tertentu. |

### 4. Siapkan brief tugas

Sertakan rincian berikut agar AI tidak perlu menebak:

1. **PIC dan peran AI:** siapa pemilik tugas dan apakah AI diminta merencanakan, merancang, membuat, menguji, mereview, memperbaiki, atau mendokumentasikan.
2. **Tujuan:** hasil spesifik yang ingin dicapai.
3. **Konteks saat ini:** apa yang sudah ada, apa yang belum ada, keputusan yang sudah disetujui, dan dependensi yang telah tersedia.
4. **Batas pekerjaan:** fitur/halaman/file yang termasuk dan yang tidak termasuk dalam tugas.
5. **Acuan:** path kode, spesifikasi, kontrak API, screenshot, atau ekspor Figma yang perlu dibaca.
6. **Kriteria selesai:** perilaku atau keluaran yang bisa diperiksa untuk menyatakan tugas selesai.
7. **Batasan:** aturan `.cursorrules`, batas input, keamanan, tampilan Figma, atau format hasil yang wajib dipatuhi.

Untuk pekerjaan UI, sebutkan layar Figma yang relevan dan path `docs/design-reference/figma-exports/`. Minta AI meniru desain yang tersedia; jangan memberi instruksi seperti "buat UI yang menarik" tanpa menyebut acuan.

### 5. Kirim prompt dengan urutan yang tepat

Gunakan urutan kerja berikut ketika tugas melewati beberapa peran:

1. **Rencana sprint:** gunakan `task-breakdown.md` untuk memecah fitur dan dependensi.
2. **Blueprint:** gunakan `api-designer.md` sebelum implementasi yang membutuhkan skema/API baru. Minta tim meninjau dan menyetujui kontraknya.
3. **Implementasi:** kirim tugas kepada AI coding dengan brief yang disepakati, path file yang relevan, `.cursorrules`, dan acuan UI bila ada. Prompt coder harus menyatakan dengan jelas file/fitur yang boleh diubah dan apa yang tidak boleh dikerjakan.
4. **Review dan QA:** setelah kode tersedia, gunakan `quality-checker.md` untuk review kode dan `qa-tester.md` untuk merancang langkah pengujian. Jangan menyamakan pembuatan test case dengan pelaksanaan pengujian.
5. **Perbaikan dan dokumentasi:** gunakan `the-fixer.md` berdasarkan temuan nyata; setelah implementasi terverifikasi, gunakan `the-documenter.md` untuk dokumentasi faktual.

Tidak semua tugas membutuhkan semua prompt. Pilih hanya prompt yang relevan. Untuk bug, mulai dari `the-fixer.md`; untuk dokumentasi, mulai dari `the-documenter.md` dan berikan kode aktual.

## Template Brief untuk AI

Isi template ini sebelum mengirim permintaan. Hapus bagian yang tidak relevan dan jangan biarkan placeholder kosong.

```text
Proyek: PahaMIn
PIC: [nama dan tanggung jawab]
Peran AI: [perencana / arsitek / coding agent / QA / reviewer / debugger / dokumenter]
Prompt peran yang harus diikuti: [path file di docs/prompts/]
Tujuan tugas: [hasil spesifik]
Konteks/status saat ini: [yang sudah ada dan yang belum ada]
Scope: [yang boleh dikerjakan]
Di luar scope: [yang tidak boleh diubah/dibangun]
Acuan yang harus dibaca: [path file, kontrak, log, atau gambar Figma]
Kriteria selesai: [cara memeriksa hasil]
Batasan: [aturan proyek, keamanan, desain, format keluaran]
Pertanyaan terbuka: [keputusan yang belum disepakati, atau tulis "tidak ada"]
```

## Contoh Prompt Siap Pakai

### Membuat rencana fitur

```text
Baca `.cursorrules`, `docs/CONTEKST_PROYEK3.md`, dan `docs/prompts/task-breakdown.md`.
Target: implementasi halaman login sesuai ekspor Figma yang tersedia.
PIC: Krisna untuk UI; Calvin untuk Auth dan Supabase; Alda untuk QA.
Gunakan `docs/design-reference/figma-exports/LOGIN.png` dan `SIGN IN.png` sebagai acuan. Jangan merancang UI baru.
Hasilkan urutan micro-task, dependensi, file target, PIC, dan Definition of Done. Jangan menulis kode.
```

### Meminta rancangan API

```text
Baca `.cursorrules`, `docs/project-requirements.md`, `docs/CONTEKST_PROYEK3.md`, dan `docs/prompts/api-designer.md`.
Rancang kontrak API untuk upload PDF Ruang Paham. Ikuti batas PDF 5 MB dan ekstraksi maksimal 20 halaman.
Berikan request/response JSON, error, validasi Pydantic yang dibutuhkan, alur data, dan kebutuhan akses database/RLS.
Jangan menulis implementasi kode. Tandai keputusan yang belum ditetapkan sebagai pertanyaan.
```

### Meminta implementasi UI

```text
Baca `.cursorrules`, `docs/CONTEKST_PROYEK3.md`, `docs/UI_DESIGN_REFERENCE.md`, dan file komponen yang terkait.
Implementasikan [nama layar/komponen] di [path target] mengikuti [nama file PNG Figma] di `docs/design-reference/figma-exports/`.
Pertahankan layout, warna, tipografi, ikon, dan jarak sesuai acuan. Jangan mendesain ulang atau mengubah halaman lain.
Gunakan komponen dan pola teknologi yang sudah tersedia. Jika desain tidak menjelaskan suatu keputusan visual, tanyakan sebelum membuat perubahan substantif.
Kriteria selesai: [perilaku/tampilan yang harus ada].
```

### Melaporkan bug

```text
Baca `.cursorrules`, konteks proyek, dan `docs/prompts/the-fixer.md`.
Bug: [perilaku yang salah].
Langkah reproduksi: 1) ... 2) ... 3) ...
Hasil yang diharapkan: [...]. Hasil aktual: [...].
Log/stack trace: [tempel log lengkap, hilangkan token atau rahasia].
Periksa penyebabnya dan usulkan perbaikan terisolasi. Jangan menulis ulang file yang tidak terkait.
```

## Pemeriksaan Sebelum Mengirim

- Prompt peran yang dipilih sesuai jenis tugas.
- AI menerima konteks status terbaru dan acuan file yang benar.
- Scope dan file yang boleh diubah disebutkan secara spesifik.
- Tugas UI menyebut referensi Figma dan larangan redesign.
- Kriteria selesai bisa diperiksa; permintaan tidak hanya berbunyi "perbaiki" atau "buat lebih bagus".
- Kredensial, `.env`, service role key, password, dan data rahasia tidak ditempel ke prompt. Gunakan nama env atau placeholder.
- Setelah mendapat jawaban, cek apakah AI membedakan asumsi dari fakta, mematuhi scope, dan tidak mengklaim verifikasi yang belum dijalankan.

Jika hasil AI melenceng, balas dengan bagian yang salah, acuan yang harus dipatuhi, dan perubahan yang Anda inginkan. Jangan mengulang semua konteks kecuali konteks sebelumnya tidak lagi tersedia.
