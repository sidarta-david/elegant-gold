# 💍 Undangan Pernikahan Digital (Single Page Application)

Aplikasi web undangan pernikahan digital berbasis **Single Page Application (SPA)** yang dibangun menggunakan **HTML5**, **Tailwind CSS**, dan **Vanilla JavaScript**. Proyek ini dirancang dengan arsitektur **Single Source of Truth (SSOT)** sehingga seluruh data klien dan konfigurasi fitur dapat dikelola dari satu file terpusat tanpa menyentuh logika sistem inti (*Core Engine*).

---

## ✨ Fitur Utama

- **Cover Amplop Interaktif 3D & Efek Partikel**: Animasi amplop terbuka saat segel hati diklik, dilengkapi efek kunang-kunang (*Firefly Canvas*) dan pemutar musik latar otomatis.
- **Konfigurasi Terpusat (*Single Source of Truth*)**: Seluruh data mempelai, acara, cerita cinta, galeri, rekening, hingga tautan Google Sheets diatur melalui `config.js`.
- **Sistem Limitasi Fitur (*Dynamic Feature Toggle*)**: Mengaktifkan atau menonaktifkan bagian tertentu (seperti *Gift*, *Wishes*, *Story*, dll.) secara otomatis menyembunyikan *section* dan tombol navigasinya.
- **Tampilan Responsif (*Mobile-First* & *Desktop View*)**: Dilengkapi navigasi *ScrollSpy* halus, dukungan *safe-area* untuk layar perangkat seluler modern, serta panel khusus pada tampilan desktop.
- **Jadwal & Peta Terintegrasi**: Informasi Akad dan Resepsi lengkap dengan sematan Google Maps (*iframe*), tombol navigasi langsung, serta tautan *Live Streaming*.
- **Hitung Mundur (*Countdown Timer*)**: Penghitung waktu mundur *real-time* yang kompatibel lintas *browser* (termasuk Safari/iOS) dengan notifikasi otomatis saat acara dimulai.
- **Galeri & Modal Lightbox**: Mendukung video *prewedding* (YouTube embed), *slideshow* foto otomatis, serta tampilan layar penuh (*Lightbox*) dengan fitur *zoom*, *play/pause slideshow*, dan navigasi *keyboard*.
- **Amplop Digital & Pengiriman Hadiah**: Fitur salin nomor rekening dan alamat pengiriman kado fisik (*Copy to Clipboard*) dengan indikator status tersalin.
- **RSVP & Buku Tamu (Integrasi Google Sheets)**: Pengiriman ucapan dan konfirmasi kehadiran secara *asynchronous* (AJAX/`fetch`) yang langsung memperbarui daftar ucapan tanpa memuat ulang halaman.

---

## 📁 Struktur Proyek

```text
├── index.html                  # Struktur utama antarmuka & konfigurasi tema Tailwind
├── README.md                   # Dokumentasi proyek
└── assets/
    ├── images/                 # Aset foto mempelai, cover, our story, dan galeri
    │   ├── pengantin.jpg
    │   ├── wanita.jpg
    │   ├── Pria.jpg
    │   └── Gallery-1.jpg ...
    ├── sounds/                 # Aset audio latar belakang
    │   └── lagu-background.mp3
    ├── style/
    │   └── style.css           # Ruleset tata letak inti, animasi 3D amplop, & keyframes
    └── script/
        ├── config.js           # Data klien & pengaturan fitur (SAFE TO EDIT)
        └── script.js           # Mesin injeksi data, animasi canvas, lightbox, & API (DO NOT EDIT)
```

---

## 🛠️ Panduan Kustomisasi (*Safe-Edit Zones*)

Untuk menjaga stabilitas sistem dan mencegah regresi tampilan (*Zero Structural Regression*), proyek ini memisahkan area aman edit dari kode inti menggunakan penanda komentar (*Marker Comments*).

### 1. Mengubah Data Pengantin & Fitur (`assets/script/config.js`)
Buka file `config.js` dan sesuaikan nilai di dalam objek `WEDDING_CONFIG`:
- **`fitur`**: Ubah nilai `true` atau `false` untuk menampilkan/menyembunyikan menu dan seksi halaman.
- **`mempelai`**: Ubah nama panggilan, nama lengkap, urutan anak, nama orang tua, dan jalur foto.
- **`acara`**: Perbarui tanggal, waktu, alamat, tautan Google Maps (`mapUrl` & `mapEmbed`), serta `countdownDate` (`YYYY-MM-DD`) dan `countdownTime` (`HH:MM:SS`).
- **`ceritaCinta`**: Tambah atau ubah daftar perjalanan cinta (*timeline*).
- **`galeri`**: Perbarui tautan *embed* video YouTube dan daftar foto galeri.
- **`amplop`**: Ubah informasi rekening bank dan alamat pengiriman kado fisik.
- **`wishes.sheetUrl`**: Masukkan URL Web App dari Google Apps Script untuk menghubungkan form ucapan ke Google Sheets.

### 2. Mengubah Palet Warna Tema (`index.html`)
Cari blok `DESIGN TOKENS: GLOBAL THEME VARIABLES` di dalam tag `<head>` pada `index.html` untuk menyesuaikan kode warna Hex:
```javascript
colors: {
  "surface": "#131313",
  "primary": "#d4af37",
  "on-surface": "#e4e2e1",
  "on-surface-variant": "#d0c5af",
  "surface-container": "#1f2020"
}
```

### 3. Aturan *Core Guardrails* (`DO NOT EDIT`)
> ⚠️ **Peringatan:** Jangan mengubah struktur ID elemen HTML, kelas CSS animasi pada `style.css`, maupun logika pada `script.js` yang ditandai dengan komentar **`STATUS: DO NOT EDIT`**. Perubahan pada area tersebut dapat merusak *data-binding*, fungsi *ScrollSpy*, dan animasi 3D amplop.

---

## 🧪 Catatan QA & Perbaikan *Bug* (UAT Changelog)

Berdasarkan hasil *User Acceptance Testing* (UAT) dan *code review*, perbaikan berikut telah diterapkan pada `script.js`:

1. **Penanganan *Fallback* Database Kosong (`fetchWishes`)**: Mencegah animasi *loading spinner* berputar tanpa henti apabila `wishes.sheetUrl` pada `config.js` belum diisi, dengan menampilkan pesan informasi yang ramah pengguna.
2. **Perbaikan Salin Alamat Tersembunyi (`copyText`)**: Menggunakan `targetElement.textContent` sebagai prioritas sebelum `innerText` agar proses penyalinan alamat pengiriman hadiah (yang memiliki kelas `hidden`) berjalan akurat di seluruh *browser* (termasuk Safari dan Firefox).
3. **Kompatibilitas Format Tanggal Lintas *Browser* (*Countdown*)**: Mengonversi tanda hubung (`-`) menjadi garis miring (`/`) pada string tanggal sebelum diproses oleh `new Date()` guna mencegah error `NaN` pada perangkat iOS/Safari versi lama.

---

## 📝 Standar Pengembangan (*Conventional Commits*)

Gunakan format *Conventional Commits* saat melakukan pembaruan pada repositori proyek:

- `docs(template): ...` — Pembaruan dokumentasi atau anotasi kode.
- `fix(core): ...` — Perbaikan *bug* atau celah logika.
- `style(theme): ...` — Penyesuaian warna, aset gambar, atau teks statis pada *Safe-Edit Zone*.
- `refactor(core): ...` — Penyempurnaan struktur kode tanpa mengubah fungsionalitas.
