# Design Brief PahaMIn

| Informasi | Nilai |
|---|---|
| Produk | PahaMIn |
| Status | Brief desain sebelum implementasi UI |
| Sumber produk | `docs/project-requirements.md` |
| Sumber visual | `docs/panduan/UI_DESIGN_REFERENCE.md` dan `docs/design-reference/figma-exports/` |
| Prinsip implementasi | Menjaga desain Figma sebagai acuan visual; bukan memulai ulang desain |

Dokumen ini menetapkan arah implementasi antarmuka PahaMIn berdasarkan PRD dan ekspor layar Figma yang tersedia. Keputusan yang ditandai **Rekomendasi untuk persetujuan tim** belum menjadi kebutuhan produk final. Tidak ada kode atau desain baru yang dibuat sebagai bagian dari brief ini.

## Ringkasan Keputusan Desain

1. Pertahankan shell aplikasi yang sudah tampak di Figma: sidebar kiri, header atas, bidang kerja abu-abu muda, kartu putih, dan biru sebagai aksen tindakan serta navigasi aktif.
2. Jadikan Matriks Tugas dan Ruang Paham sebagai dua jalur utama belajar. Kontrol teks tetap tersedia walaupun input suara didukung.
3. Terapkan label kuadran Figma `Do`, `Decide`, `Delegate`, dan `Delete`; jelaskan bahwa `Delete` adalah kategori prioritas, bukan tindakan menghapus tugas.
4. Ganti statistik kuis pada desain profil dengan jumlah percakapan Ruang Paham. Ini mempertahankan susunan visual kartu statistik tanpa menghidupkan kembali fitur kuis yang dihapus PRD.
5. Gunakan Geist yang sudah dimuat di frontend sebagai font awal. Ekspor PNG tidak mengungkap nama font Figma, dan menambah font lain tanpa bukti akan menjauhkan implementasi dari sistem proyek yang ada.
6. Target aksesibilitas adalah WCAG 2.2 AA. Pada permukaan abu-abu, gunakan teks lebih gelap daripada abu-abu sekunder agar rasio kontras tetap memenuhi batas.
7. Tetapkan Bahasa Indonesia sebagai bahasa awal. Pertahankan nama produk dan label kuadran sesuai acuan; teks Inggris lain di ekspor perlu dilokalkan konsisten sebelum rilis.
8. MVP tidak memiliki mode offline. Saat koneksi terputus, tampilkan status dan lindungi input pengguna; jangan menampilkan data seolah perubahan sudah tersimpan.

## 1. Design Principles

### 1.1 Setia pada layar Figma

Bangun ulang komposisi, hierarki, warna, bentuk, ikon, dan pola interaksi yang terlihat di ekspor. Komponen baru hanya boleh mengisi kebutuhan perilaku, responsivitas, atau aksesibilitas dengan perubahan visual minimum. PNG menjadi referensi, bukan layar produk.

### 1.2 Satu langkah utama terlihat jelas

Setiap layar memiliki satu tindakan utama yang paling menonjol: masuk, simpan tugas, unggah PDF, kirim pertanyaan, atau simpan profil. Tindakan sekunder tetap tersedia tetapi tidak bersaing dengan tombol primer. Pertanyaan AI harus selalu terikat pada dokumen yang dipilih.

### 1.3 Kesalahan dapat dipahami dan dipulihkan

Tampilkan validasi dekat dengan input dan error proses dengan langkah berikutnya yang jelas. Perpindahan tugas menggunakan optimistic UI hanya jika dapat di-rollback. Jangan bergantung pada warna saja untuk menandai kuadran, status, fokus, loading, atau error.

## 2. Visual Direction

### Mood

Tenang, terang, teratur, dan mendukung fokus belajar. Kanvas netral mengurangi kompetisi visual dengan materi; biru menandai navigasi aktif dan tindakan; warna kuadran membantu memilah urgensi tanpa menjadikan keseluruhan produk terasa seperti alarm.

### Referensi dari ekspor

- Shell konsisten dengan sidebar pucat di kiri dan header putih di atas.
- Halaman kerja memakai latar abu-abu sangat muda dan kartu putih dengan sudut membulat serta bayangan lembut.
- Matriks menggunakan empat panel dalam susunan dua kali dua pada desktop. Masing-masing panel memiliki ikon, nama, penjelasan singkat, jumlah, dan daftar tugas.
- Ruang Paham memiliki ruang kosong luas, judul besar di tengah, daftar percakapan pada sidebar, dan composer di bagian bawah.
- Profil menggabungkan formulir identitas di area utama dengan panel aktivitas yang lebih sempit.
- Aksen biru tampak pada logo, navigasi aktif, link, tombol utama, garis fokus, dan status pilihan.

### Hindari

- Mengganti shell Figma dengan dashboard template generik, navigasi bawah baru di desktop, atau layout gelap sebagai default.
- Gradien warna besar, blur/glass effect, terlalu banyak aksen terang, animasi dekoratif, atau kartu statistik tambahan yang tidak ada di PRD.
- Menampilkan tanggapan AI sebagai fakta tanpa penanda bahwa jawabannya berasal dari dokumen terpilih.
- Menggunakan ikon tanpa label/tooltip yang dapat dipahami atau hanya mengandalkan warna.
- Memasang screenshot Figma sebagai halaman atau latar produk.

## 3. Design Tokens

Token berikut mengikuti warna wajib proyek dan warna yang tampak pada ekspor. Status kuadran memakai latar pastel dan teks/ikon gelap, bukan teks terang di atas warna pekat.

### Warna

| Token | Nilai | Penggunaan |
|---|---|---|
| Brand / primary | `#2563EB` | Tombol primer, navigasi aktif, link dan elemen brand. |
| Brand hover / active | `#1D4ED8` | Hover/pressed dan teks status biru pada latar biru pucat. |
| App background | `#F3F4F6` | Kanvas umum halaman setelah shell. |
| Surface / card | `#FFFFFF` | Kartu, dialog, composer, bidang input utama. |
| Text primary | `#1F2937` | Judul dan isi penting. |
| Text secondary | `#6B7280` | Teks sekunder pada permukaan putih. Pada latar `#F3F4F6`, gunakan warna teks lebih gelap. |
| Text on neutral background | `#4B5563` | Isi dan navigasi di atas latar abu-abu muda. |
| Border / divider | `#CBD5E1` | Batas input, pembagi, dan outline yang perlu terlihat. |
| Subtle surface | `#E5E7EB` | Area input netral, badge nonaktif, dan pemisah visual. |
| Focus ring | `#1D4ED8` | Ring fokus 2 px dengan offset yang terlihat pada semua permukaan. |
| Do | `#FEE2E2` + `#B91C1C` | Latar panel/badge dan ikon/teks kuadran Do. |
| Decide | `#DBEAFE` + `#1D4ED8` | Latar panel/badge dan ikon/teks kuadran Decide. |
| Delegate | `#FEF3C7` + `#92400E` | Latar panel/badge dan ikon/teks kuadran Delegate. |
| Delete | `#E5E7EB` + `#4B5563` | Latar panel/badge dan ikon/teks kuadran Delete. |
| Success | `#DCFCE7` + `#166534` | Konfirmasi berhasil yang tetap memiliki label atau ikon. |
| Error | `#FEF2F2` + `#B91C1C` | Pesan gagal dan validasi yang tetap memiliki teks. |

Rasio kontras yang dihitung terhadap pasangan warna di atas: `#2563EB` pada putih **5,17:1**; `#6B7280` pada putih **4,83:1**; `#6B7280` pada `#F3F4F6` **4,39:1**; `#4B5563` pada `#F3F4F6` **lebih dari 6:1**. Karena teks sekunder gagal tipis pada kanvas abu-abu, gunakan `#4B5563` di sana. Angka ini adalah perhitungan warna token, bukan pengganti pemeriksaan kontras tiap kombinasi setelah implementasi.

### Tipografi

Gunakan **Geist Sans** yang sudah dimuat di `web/app/layout.tsx`. Geist dipilih karena tersedia tanpa menambah dependency, tetap terbaca dalam paragraf ringkasan/chat yang panjang, dan tampil dekat dengan sans modern pada ekspor. Pertahankan keluarga font tunggal; gunakan berat dan ukuran untuk membangun hierarki.

| Gaya | Ukuran / line-height | Berat | Penggunaan |
|---|---|---|---|
| Display | 40 / 48 px | 700 | Headline Ruang Paham pada desktop; turun ke 32 / 40 px di layar kecil. |
| H1 | 32 / 40 px | 700 | Judul halaman utama. |
| H2 | 24 / 32 px | 600 | Judul section dan heading panel. |
| H3 | 20 / 28 px | 600 | Judul kartu dan dialog. |
| Body | 16 / 24 px | 400 | Teks umum, daftar, input, dan percakapan. |
| Body small | 14 / 20 px | 400 atau 500 | Label, metadata, bantuan singkat. |
| Caption | 12 / 16 px | 500 | Badge, counter, dan detail non-esensial saja. |

Jangan memakai ukuran 12 px untuk petunjuk penting, error, tombol, atau informasi yang perlu dibaca terus-menerus. Label kuadran tetap memakai kapitalisasi dan tracking visual dari Figma bila terbaca.

### Spacing, radius, dan elevasi

| Kelompok | Skala |
|---|---|
| Spacing | `4, 8, 12, 16, 24, 32, 40, 48, 64 px`; gunakan 8 px sebagai ritme dasar. |
| Input/button | Tinggi minimum 44 px; target sentuh nyaman 48 px. |
| Radius | `8 px` kontrol kecil, `12 px` input/badge besar, `16 px` kartu kompak, `24 px` kartu halaman, `32 px` panel autentikasi besar, `999 px` pill. |
| Shadow small | `0 2px 8px rgba(31, 41, 55, 0.08)` untuk input aktif atau menu terapung. |
| Shadow card | `0 8px 24px rgba(31, 41, 55, 0.08)` untuk panel matriks dan area chat. |
| Shadow dialog | `0 16px 40px rgba(31, 41, 55, 0.14)` untuk dialog autentikasi/modal. |

Bayangan harus tetap halus seperti ekspor. Matriks Eisenhower dan panel Ruang Paham memakai shadow card sesuai aturan proyek. Jangan memakai shadow sebagai satu-satunya pemisah komponen.

## 4. Screen Inventory

| Screen / area | Tujuan | Status acuan |
|---|---|---|
| Shell aplikasi | Memberi akses konsisten ke Ruang Paham, Matriks Tugas, notifikasi, profil, serta pengaturan. | Tampak berulang di banyak ekspor. |
| Ruang Paham — kosong/awal | Memulai sesi dengan pilihan menambahkan materi atau meminta penjelasan; menampilkan riwayat percakapan di sidebar. | Tercermin di `Landing Page - Ketik 1.png`, `Landing Page - Ketik 2.png`, `Landing Page - Ketik 3.png`, `FULL Landing Page.png`, dan `Main Content Shell.png`. |
| Ruang Paham — unggah dan chat | Memilih PDF, melihat dokumen terpilih, mengajukan pertanyaan, membaca ringkasan/jawaban, serta menghentikan atau membatalkan aksi yang sedang berlangsung. | Tercermin di `Drop FIle 1.png`, `Drop FIle 2.png`, `Cancel.png`, dan `Stop.png`. |
| Login | Mengautentikasi akun dengan email dan password; jalur sosial terlihat di satu ekspor. | `LOGIN.png` dan `Group 21.png`. |
| Daftar akun | Membuat akun dan mengarahkan pengguna yang sudah punya akun ke login. | `SIGN IN.png` dan `Group 22.png`. |
| Matriks Tugas | Membantu pengguna memahami dan mengelola tugas di empat kuadran prioritas. | `MATRIKS TUGAS.png` dan `MATRIKS TUGAS 2.png`. |
| Profil — lihat | Melihat identitas serta ringkasan aktivitas belajar. | `Profile.png` dan variasinya. |
| Profil — edit | Memperbarui identitas, foto, bio, serta informasi akademik opsional. | `Profile-2.png` dan variasinya. |
| Notifikasi | Meninjau pemberitahuan dari ikon lonceng/area akun. | Tautan ada pada shell dan navigasi profil; detail konten harus mengacu pada semua ekspor terkait. |
| Kata sandi dan privasi | Mengelola keamanan akun dan preferensi privasi. | Ada sebagai item navigasi profil, tetapi tidak tersedia layar detail yang cukup. |
| Pengaturan tampilan | Memilih tema, ukuran teks, dan bahasa. | `Settings and help - Tema.png`, `Settings and help - Ukuran Teks.png`, dan `Settings and help - Bahasa.png`. |
| Pengaturan notifikasi | Mengatur pengingat tugas dan streak belajar. | `Settings and help - Notifikasi Pengingat Tugas.png` dan `Settings and help - Notifikasi Streak Belajar.png`. |
| Bantuan | Membuka FAQ, melaporkan bug, atau mengirim feedback. | Empat ekspor Settings and help terkait. Beberapa area konten berupa placeholder kosong; konten aktual belum didefinisikan. |

### Keputusan konflik/acuan

- Profil Figma memiliki kartu `Kuis dikerjakan`; PRD secara eksplisit menghapus kuis. Isi posisi itu dengan `Percakapan Ruang Paham` dan hitung dari data chat. Jangan menyimpan metrik kuis hanya demi meniru isi contoh.
- Beberapa layar autentikasi memakai bahasa Inggris dan menampilkan Google/GitHub/Apple. Rekomendasi MVP adalah email/password dalam Bahasa Indonesia. Tampilkan tombol provider hanya setelah tim mengonfirmasi provider Supabase dan kredensialnya; jangan menampilkan tombol sosial yang tidak berfungsi.
- Ekspor untuk beberapa halaman pengaturan/bantuan masih berupa bidang kosong. Pertahankan shell dan hirarki navigasi yang terlihat, tetapi jangan mengarang isi ilustrasi/FAQ ataupun aksi belum disepakati.
- PRD menyebut tema, ukuran teks, bahasa, pengingat, dan streak sebagai keputusan terbuka. Untuk brief ini, tampilan pilihan tetap mengikuti ekspor; persistensi, cakupan tema gelap, daftar bahasa, jadwal reminder, dan definisi streak menunggu keputusan produk.

## 5. User Flows

### 5.1 Masuk dan daftar

1. Pengguna membuka halaman publik dan memilih masuk atau membuat akun.
2. Pengguna mengisi email dan password; validasi inline membantu memperbaiki input sebelum submit.
3. Tombol utama berubah ke status memproses dan mencegah submit ganda.
4. Jika kredensial ditolak, pesan muncul di dekat form tanpa menghapus input yang aman untuk dipertahankan.
5. Jika berhasil, pengguna masuk ke layar terlindungi yang terakhir atau Matriks Tugas.
6. Link lupa password mengarah ke alur pemulihan; metode verifikasi harus disepakati dengan tim Auth.

**Rekomendasi MVP:** gunakan email/password saja sampai tim menetapkan provider sosial dan konfigurasi Supabase. Ini menghindari affordance yang terlihat siap tetapi gagal saat dipakai.

### 5.2 Membuat dan mengelola tugas

1. Pengguna membuka Matriks Tugas dari sidebar.
2. Layar menampilkan empat panel dengan jumlah tugas dan daftar setiap kuadran.
3. Pengguna memilih `Tambah tugas`; dialog atau form ringkas meminta judul, urgensi, dan kepentingan.
4. Sistem menentukan kuadran awal dari urgensi/kepentingan dan menampilkan tujuan sebelum simpan.
5. Setelah simpan berhasil, tugas muncul pada kuadran terkait dan count diperbarui.
6. Pengguna menyelesaikan tugas dengan checkbox; item berubah tampilan dan status tersimpan.
7. Pengguna desktop memindahkan kartu dengan drag-and-drop atau kontrol keyboard. UI pindah seketika; bila request gagal, kartu kembali dan Sonner memberi pesan.
8. Di layar kecil, pengguna memakai kontrol `Pindahkan ke kuadran`; drag bukan satu-satunya cara.

Tanggal tenggat, edit, delete, dan perubahan klasifikasi setelah perpindahan belum ditetapkan dalam PRD; jangan tambahkan dalam desain final sebelum disetujui.

### 5.3 Memahami materi PDF

1. Pengguna membuka Ruang Paham; layar awal menjelaskan tindakan yang tersedia.
2. Pengguna menekan `Tambah` atau memilih PDF dari drop zone.
3. UI memeriksa tipe dan batas 5 MB sebelum upload; kegagalan validasi menampilkan alasan dan pilihan mengganti berkas.
4. UI membedakan progres upload dari pemrosesan AI dan memberi tahu bahwa paling banyak 20 halaman pertama diproses.
5. Ketika pemrosesan sukses, dokumen tampil sebagai chip/list item aktif dan ringkasan muncul.
6. Pengguna menulis pertanyaan atau memakai voice input opsional, lalu mengirim.
7. Composer menampilkan loading; pengguna bisa menghentikan generasi jika kontrol tersedia.
8. Jawaban tampil dalam thread dan disimpan ke riwayat. Jika konteks dokumen tidak cukup, jawaban menyatakannya dengan jujur.
9. Pengguna dapat memilih percakapan terdahulu dari sidebar dan melanjutkan konteks dokumen yang sesuai.

### 5.4 Profil

1. Pengguna membuka menu profil dan memilih `Edit Profil`.
2. Layar profil memperlihatkan identitas dan statistik di panel samping.
3. Pengguna memilih `Edit`, memperbarui field, dan menekan `Simpan Perubahan`.
4. Data divalidasi; sukses memberi konfirmasi dan kembali ke mode baca atau mempertahankan form tersimpan.
5. `Batal` membuang perubahan yang belum disimpan setelah konfirmasi bila ada perubahan.

### 5.5 Pengaturan dan bantuan

1. Pengguna masuk ke Setelan & bantuan melalui navigasi akun.
2. Sidebar menampilkan kategori tampilan, notifikasi, dan bantuan; kategori aktif mendapat penanda biru.
3. Pengguna mengubah preferensi tema/ukuran/bahasa atau memilih pengingat.
4. Perubahan disimpan dan mendapat status berhasil; bila gagal, pilihan visual kembali ke nilai tersimpan.
5. Pengguna membuka FAQ, laporan bug, atau feedback melalui item navigasi yang sesuai.

Perilaku reminder, lokasi pengiriman laporan/feedback, serta apakah preferensi berlaku per perangkat atau akun masih keputusan terbuka. Jangan menyimulasikan pengiriman sukses jika endpoint belum ada.

## 6. Layout per Screen

| Screen | Section dan hierarki | Primary action | Komponen utama |
|---|---|---|---|
| Shell | Sidebar brand/nav → topbar notifikasi/avatar → judul/konten route. | Navigasi ke area aktif. | `AppShell`, `Sidebar`, `TopBar`, `NavItem`, `IconButton`, avatar menu. |
| Ruang Paham kosong | Headline dan keterangan → CTA tambah materi/composer → daftar riwayat di sidebar. | Tambah PDF atau ketik pertanyaan sesuai ketersediaan dokumen. | `EmptyState`, `UploadTrigger`, `ChatComposer`, `ConversationList`. |
| Ruang Paham chat | Chip dokumen aktif → urutan bubble user/asisten → composer tetap di bawah. | Kirim pertanyaan. | `DocumentChip`, `MessageBubble`, `SourceNote`, `ChatComposer`, `StopButton`. |
| Login | Judul/subjudul → email → password → ingat saya/lupa password → tombol utama → alternatif yang telah disetujui. | Masuk. | `AuthPanel`, `TextField`, `PasswordField`, `Checkbox`, `Button`, `InlineAlert`. |
| Daftar | Judul/subjudul → field akun → tombol daftar → link menuju login. | Buat akun. | `AuthPanel`, `TextField`, `PasswordField`, `Button`, `FormHint`. |
| Matriks | Judul/aksi tambah → grid 2×2 → panel per kuadran → count dan task rows. | Tambah tugas. | `MatrixGrid`, `QuadrantPanel`, `TaskCount`, `TaskCard`, `TaskCheckbox`, `MoveTaskMenu`. |
| Profil lihat | Judul dan edit → kartu identitas → statistik/streak → informasi akademik. | Edit profil. | `ProfileIdentity`, `StatCard`, `StreakBanner`, `SectionCard`, `Button`. |
| Profil edit | Judul → aksi batal/simpan → identitas dan form dua kolom → info akademik opsional. | Simpan perubahan. | `AvatarPicker`, `TextField`, `Textarea`, `CharacterCount`, `Button`. |
| Notifikasi | Judul → daftar pemberitahuan terbaru → status sudah dibaca/belum. | Buka pemberitahuan. | `NotificationList`, `NotificationItem`, `UnreadMarker`, `EmptyState`. |
| Pengaturan | Navigasi kategori → judul kategori → kontrol pilihan dalam permukaan putih. | Simpan atau terapkan preferensi. | `SettingsNav`, `SettingsSection`, `RadioGroup`, `Switch`, `Select`, `SaveStatus`. |
| Bantuan | Judul → kategori FAQ/laporan/feedback → konten dan form yang sudah disetujui. | Cari jawaban atau kirim laporan. | `Accordion`, `Textarea`, `FileField` jika disetujui, `Button`, `InlineAlert`. |

Dimensi desktop awal yang direkomendasikan adalah sidebar sekitar 256 px dan header sekitar 64–72 px. Ini titik mula implementasi; sesuaikan dengan proporsi screenshot pada viewport acuan, bukan aturan kaku.

## 7. Component Library

| Komponen reusable | Variasi | State wajib |
|---|---|---|
| Button | Primary, secondary, text/link, destructive, icon-only. | Default, hover, focus-visible, pressed, disabled, loading. |
| Text field / textarea | Email, password, pencarian, pesan, multi-line. | Default, focus, filled, invalid, disabled, read-only. |
| Checkbox / switch / radio | Form, pengaturan, tugas selesai, pilihan tunggal/ganda. | Checked, unchecked, focus, disabled, error. |
| App shell navigation | Sidebar expanded/collapsed, item active, mobile drawer. | Active, hover, keyboard focus, drawer open/closed. |
| Page header | Judul, deskripsi, satu aksi utama, aksi sekunder. | Default, compact mobile, action loading. |
| Surface card | Section, profile, stat, matrix quadrant, chat panel. | Default, interactive, loading, error bila berisi data dinamis. |
| Quadrant panel | Do, Decide, Delegate, Delete. | Empty, populated, drag-over, pending mutation, error rollback. |
| Task card | Tugas biasa, selesai, sedang dipindahkan. | Default, checked, focus/selected, dragging, optimistic, revert. |
| Dialog / sheet | Tambah tugas, konfirmasi, detail ringkas; sheet untuk mobile. | Open/closed, focus trapped, submitting, validation error. |
| Toast | Success, error, info. | Muncul/dismiss; pesan tidak hanya dibedakan oleh warna. |
| Chat message | User, assistant, error/fallback, sumber. | Sending, generating, complete, failed, copy/read aloud bila disetujui. |
| Chat composer | Teks, lampiran, voice input, send/stop. | Empty, typing, selected PDF, sending, recording, generating, disabled. |
| PDF upload | Drop zone desktop, file picker mobile, selected file, progress. | Idle, invalid type, too large, uploading, processing, success, failed. |
| Profile statistic | Dokumen, tugas, percakapan, rata-rata/streak yang definisinya disetujui. | Value, loading skeleton, no activity, unavailable/error. |
| Form feedback | Label, bantuan, counter, error. | Default, invalid, submitted. |
| Empty state | Pesan singkat dan CTA spesifik halaman. | Initial/no results/no documents; tidak dipakai saat loading. |
| Skeleton | Panel matrix, profile, message list. | Loading sementara dengan ukuran mirip konten akhir. |

Gunakan shadcn/ui Base UI yang sudah tersedia bila cocok dengan acuan. Jangan membangun ulang dialog, menu, tab, atau kontrol aksesibilitas dari nol tanpa kebutuhan yang jelas.

## 8. Screen States

| Screen kunci | Empty | Loading | Error | Success | Offline |
|---|---|---|---|---|---|
| Login/daftar | Form kosong dengan label dan bantuan yang terlihat. | Tombol menunjukkan proses; cegah submit ganda. | Error inline spesifik, input tetap tersedia, kredensial tidak dibocorkan. | Konfirmasi singkat lalu arahkan ke layar terlindungi. | Banner koneksi; jangan klaim autentikasi berhasil; pertahankan input email yang aman. |
| Matriks Tugas | Bila semua kosong, jelaskan manfaat empat kuadran dan tampilkan `Tambah tugas`; kuadran kosong tetap berlabel. | Skeleton mempertahankan grid dan urutan kuadran. | Retry yang terlihat; jangan tampilkan nol palsu sebagai data berhasil. | Count dan kartu diperbarui; drag sukses tanpa toast berulang. | Tampilkan data terakhir hanya jika memang telah dimuat dan beri label belum sinkron; nonaktifkan mutasi. Rollback optimistic saat request gagal. |
| Ruang Paham | Tanpa dokumen: CTA unggah. Tanpa chat: contoh prompt ringan, bukan percakapan contoh seolah nyata. | Pisahkan status unggah, ekstraksi, dan jawaban; loading percakapan memakai skeleton. | Validasi PDF, dokumen kosong/rusak, retrieval kosong, atau AI/server gagal mendapat pesan dan aksi retry yang sesuai. | Dokumen, ringkasan, jawaban, serta riwayat diberi status tersimpan. | Jangan mulai upload/kirim pesan. Pertahankan draft pesan dan nama file yang dipilih selama sesi; tandai belum terkirim. |
| Profil | Field opsional tampil kosong dengan hint; statistik yang belum ada tampil `0` hanya bila data berhasil dimuat. | Skeleton untuk identitas dan panel statistik. | Tampilkan retry; jangan ganti data gagal dengan statistik nol. | Konfirmasi penyimpanan dan nilai profil yang diperbarui. | Field tetap dapat dibaca dari data terakhir di sesi; simpan lokal tidak dianggap tersinkron. Nonaktifkan simpan. |
| Notifikasi | Pesan belum ada pemberitahuan. | Skeleton daftar. | Retry pemuatan; pertahankan navigasi shell. | Penanda baca berubah setelah server mengonfirmasi. | Informasikan daftar belum diperbarui dan jangan mengubah read-state diam-diam. |
| Pengaturan/bantuan | Kategori kosong diberi penjelasan atau konten bantuan yang disetujui; bukan panel kosong dekoratif. | Loading per kategori. | Perubahan preferensi dikembalikan ke nilai terakhir tersimpan; laporan tidak disebut terkirim. | Status `Tersimpan` dekat kontrol dan hilang setelah jeda. | Preferensi belum tersimpan; kontrol terkait dinonaktifkan atau draft ditahan sementara. Tidak ada mode offline. |

**Aturan offline global:** produk tidak mendukung mode offline. Berikan indikator koneksi yang konsisten dan tidak menutupi konten, cegah perubahan persisten, pertahankan draft sesi bila memungkinkan, dan sediakan coba lagi. Jangan menjanjikan sinkronisasi latar belakang.

## 9. Responsive Behaviour

Ekspor Figma terutama menunjukkan layar desktop; rancangan breakpoint di bawah adalah keputusan implementasi untuk mempertahankan fungsi dan hierarki, bukan klaim bahwa layout tersebut ada di Figma.

### Desktop — 1024 px ke atas

- Sidebar tetap terbuka sekitar 256 px; topbar tetap di atas area kerja.
- Matriks memakai 2×2 grid. Jaga kartu cukup lebar untuk judul panjang dan target drag.
- Ruang Paham menggunakan sidebar percakapan dan kolom chat lebar; composer berada di dasar kolom chat tanpa menutup pesan.
- Profil memakai area form lebar dan panel statistik lebih sempit.
- Dialog autentikasi mengikuti komposisi terpusat Figma tetapi tidak merender konten akun privat di belakang dialog.

### Tablet — 768–1023 px

- Sidebar menjadi drawer atau rail yang dapat dibuka dengan tombol menu; setelah memilih route drawer tertutup.
- Matriks tetap dua kolom hanya jika tiap panel menyediakan lebar baca yang cukup; jika tidak, susun satu kolom tanpa mengubah urutan kuadran.
- Profil dan pengaturan menjadi satu kolom; panel statistik mengikuti profil, bukan dipaksa ke kolom sempit.
- Composer chat dan tindakan utama mengisi lebar konten, dengan batas baca teks jawaban.

### Mobile — di bawah 768 px

- Navigasi menjadi drawer dengan tombol menu berlabel; fokus masuk ke drawer dan kembali ke tombol saat drawer ditutup.
- Matriks tersusun vertikal sesuai PRD. Pindahkan tugas melalui menu tindakan/tap, bukan drag saja.
- Form profil, autentikasi, dan pengaturan memakai satu kolom. Dialog lebar berubah menjadi layar penuh atau bottom sheet yang tetap bisa ditutup dengan keyboard.
- Composer/chat mematuhi safe area keyboard perangkat; tombol kirim dan lampiran tidak tertutup keyboard.
- Tombol/target sentuh minimal 44×44 CSS px. Konten tidak memerlukan scroll horizontal.
- Headline turun satu tingkat; paragraf ringkasan memakai panjang baris yang nyaman; jangan mengecilkan teks di bawah token hanya agar muat.

## 10. Accessibility

### Kontras dan warna

- Ikuti WCAG 2.2 AA: teks normal minimal **4.5:1**, teks besar minimal **3:1**, dan batas/ikon kontrol yang diperlukan minimal **3:1** terhadap warna di sebelahnya.
- Teks `#6B7280` memenuhi 4.5:1 di kartu putih, tetapi sekitar 4.39:1 di latar `#F3F4F6`. Di kanvas abu-abu gunakan `#4B5563` atau lebih gelap.
- Label warna kuadran selalu disertai nama, ikon, dan keterangan urgensi/kepentingan. Status tidak dibedakan dengan warna saja.
- Ring fokus harus terlihat di permukaan putih maupun abu-abu dan tidak terpotong oleh overflow.

### Fokus dan keyboard

- Urutan fokus: tombol menu/brand → navigasi sidebar dari atas ke bawah → kontrol header → judul/konten utama → tindakan dan field berdasarkan urutan baca.
- Gunakan landmark `header`, `nav`, dan `main`; beri nama navigasi seperti `Navigasi utama` dan `Navigasi akun`.
- Semua tombol, link, input, checkbox, radio, switch, dialog, menu, tab, dan kontrol chat dapat digunakan dengan keyboard.
- Drag-and-drop tugas memiliki alternatif keyboard yang jelas: pilih tugas lalu buka `Pindahkan ke kuadran`, atau gunakan pola keyboard dari library DnD dan tetap sediakan menu tindakan.
- Dialog mengunci fokus saat terbuka, mendukung Escape jika tidak ada proses kritis, dan mengembalikan fokus ke pemicunya saat ditutup.
- Jangan menggunakan `tabIndex` positif. Kelompokkan kontrol terkait secara semantik.

### Nama aksesibel dan pembaca layar

- Setiap input punya label programatik yang terlihat; placeholder tidak menggantikan label.
- Ikon-only button seperti notifikasi, profil, mikrofon, upload, dan stop memiliki accessible name spesifik, misalnya `Buka notifikasi` atau `Hentikan jawaban`.
- Gunakan `aria-current="page"` untuk route aktif; native button/checkbox/switch jika tersedia; `aria-expanded` pada disclosure dan drawer.
- Error dihubungkan ke field dengan `aria-describedby` dan `aria-invalid`; ringkasan error form diumumkan setelah submit.
- Status upload, proses AI, hasil simpan, jumlah tugas, dan rollback diumumkan melalui live region yang tidak membacakan ulang seluruh chat.
- Pesan asisten ditandai sebagai konten percakapan; jangan otomatis memindahkan fokus saat respons selesai.
- Drop zone juga membuka pemilih file dengan tombol keyboard; validasi PDF mengumumkan nama, ukuran, alasan penolakan, dan cara memilih ulang.
- Konten ringkasan memakai heading/list semantik. Untuk tabel/statistik gunakan nama yang menguraikan nilai dan konteks.

### Gerak, suara, dan preferensi

- Hormati `prefers-reduced-motion`; animasi hanya untuk memberi feedback singkat dan tidak membawa informasi tunggal.
- Input suara adalah tambahan opsional. Tampilkan keadaan izin, mendengarkan, transkripsi, dan gagal; selalu sediakan cara mengetik.
- Text-to-speech tidak berjalan otomatis tanpa tindakan pengguna; sediakan kontrol pause/stop yang berlabel.
- Perubahan ukuran teks tidak memotong form, kartu, atau dialog. Uji zoom browser 200% dan reflow pada lebar 320 CSS px.

## Keputusan yang Harus Disetujui sebelum Implementasi Visual Final

1. Metode autentikasi MVP: rekomendasi email/password; apakah Google/GitHub/Apple tetap masuk scope?
2. Bahasa UI awal dan teks final untuk layar yang kini berbahasa Inggris.
3. Apakah tema gelap masuk MVP dan apakah preferensi disimpan per akun atau perangkat.
4. Aturan ukuran teks, bahasa yang tersedia, jadwal/kanal reminder, dan definisi streak.
5. Isi nyata halaman FAQ, laporan bug, dan feedback beserta tujuan pengirimannya.
6. Aturan edit/hapus tugas, deadline, dan dampak drag terhadap urgensi/kepentingan.
7. Definisi statistik profil, khususnya rata-rata waktu belajar dan sumber jumlah dokumen.
8. Detail layout tablet/mobile dan interaksi voice input yang tidak ditunjukkan cukup lengkap oleh ekspor.

## Checklist Handoff ke Implementasi

- Cocokkan setiap halaman dengan ekspor Figma yang relevan sebelum mengubah UI.
- Setujui keputusan terbuka di atas yang menjadi prasyarat layar tersebut.
- Gunakan token warna, tipe, spacing, radius, dan state dari dokumen ini sebagai satu sumber rujukan.
- Periksa semua screen state, breakpoint, keyboard flow, screen reader naming, dan kontras sebelum menyebut layar selesai.
- Jaga jumlah dan susunan komponen konsisten dengan ekspor; jangan menambahkan fitur visual baru tanpa persetujuan produk.
