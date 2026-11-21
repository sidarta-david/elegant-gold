# ⚙️ Dokumentasi Arsitektur Kode Sumber (`TECHNICAL_DOCS.md`)

**Proyek:** Website Undangan Pernikahan Digital  
**Mitra Industri:** UD. Rez Wan Jaya  
**Target Pembaca:** Software Developer & System Maintainer

---

## 1. Arsitektur Sistem & Pola Desain

Aplikasi ini dirancang sebagai **Static Single Page Application (SPA)** berbasis *client-side rendering* tanpa ketergantungan pada *framework* berat (*zero-build step*), sehingga dapat dijalankan langsung di atas *shared hosting* standar maupun CDN statis (GitHub Pages).

### Prinsip Arsitektur Utama:
1. **Single Source of Truth (SSOT):** Seluruh state data klien dan konfigurasi fitur dienkapsulasi ke dalam objek global `window.WEDDING_CONFIG` pada `assets/script/config.js`.
2. **Declarative Template Tagging:** Pemisahan lapisan presentasi (`index.html`) dari data (`config.js`) menggunakan atribut kustom HTML5 (`data-template`, `data-template-src`, dan `data-template-href`) yang diproses saat event `DOMContentLoaded`.
3. **System Core Guardrails:** Isolasi komponen struktural dan logika bisnis menggunakan penanda batas eksplisit (`SAFE TO EDIT` vs `DO NOT EDIT`) untuk mencegah *structural regression* saat proses kustomisasi produksi.

---

## 2. Hirarki Direktori & Struktur Berkas

```text
root/
├── index.html                        # Dokumen utama HTML5 semantik, Tailwind CDN config, & marker zones
├── README.md                         # Ringkasan repositori, laporan UAT, & log perbaikan bug
├── USER_GUIDE.md                     # Panduan operasional kustomisasi untuk admin non-teknis
├── TECHNICAL_DOCS.md                 # Spesifikasi arsitektur teknis & deployment (dokumen ini)
└── assets/
    ├── images/                       # Aset visual terkompresi (foto mempelai, story, galeri)
    ├── sounds/
    │   └── lagu-background.mp3       # Berkas audio latar belakang undangan
    ├── style/
    │   └── style.css                 # Core layout engine, custom scrollbar, 3D envelope, & keyframes
    └── script/
        ├── config.js                 # [SAFE TO EDIT] Objek konfigurasi data & feature flags
        └── script.js                 # [DO NOT EDIT] Core engine injeksi data, animasi, & integrasi API
```

---

## 3. Spesifikasi *Template Tagging Engine*

Mekanisme *data binding* pada `assets/script/script.js` menggunakan fungsi *resolver* objek bersarang (`getNestedValue(obj, path)`) untuk memetakan *dot-notation path* dari `WEDDING_CONFIG` ke elemen DOM:

| Atribut HTML | Target Properti DOM | Contoh Penggunaan di `index.html` |
| :--- | :--- | :--- |
| `data-template` | `el.textContent` | `<h1 data-template="mempelai.panggilanSingkat"></h1>` |
| `data-template-src` | `el.setAttribute('src', val)` | `<img data-template-src="mempelai.wanita.foto">` |
| `data-template-href` | `el.setAttribute('href', val)` | `<a data-template-href="acara.akad.mapUrl"></a>` |

---

## 4. Dokumentasi Modul & Fungsi JavaScript (`assets/script/script.js`)

Arsitektur logika di dalam `script.js` dibagi menjadi 8 blok fungsional terstruktur:

### Anotasi 1: Mesin Injeksi Data & *Feature Toggles*
* **Injeksi Statis:** Melakukan iterasi pada seluruh node `[data-template]`, `[data-template-src]`, dan `[data-template-href]`.
* **Render Dinamis (`story-container` & `gallery-slideshow-container`):** Membangun elemen HTML *timeline* kisah cinta dan *slide* foto galeri secara dinamis berdasarkan panjang array `ceritaCinta` dan `galeri.foto`.
* **Feature Flags (`config.fitur`):** Memetakan kunci boolean ke ID `<section>` dan tautan navigasi (`a.nav-link[href="#..."]`). Jika bernilai `false`, elemen diatur ke `display: none`.

### Anotasi 2: Sistem Partikel Canvas & *IntersectionObserver*
* **HTML5 Canvas (`Particle` & `Firefly`):** Menjalankan *animation loop* berbasis `requestAnimationFrame` untuk merender efek partikel emas pada `#particle-canvas`, `#firefly-canvas` (desktop), dan `#cover-firefly-canvas` (sampul).
* **ScrollSpy Navigation (`navObserver`):** Memantau posisi gulir pada `#mobile-container` dengan `rootMargin: '-30% 0px -50% 0px'` untuk memperbarui kelas `.active-menu` pada navigasi mobile maupun desktop.
* **Scroll Reveal (`animObserver`):** Menambahkan kelas `.is-visible` pada elemen `.animate-on-scroll` saat memasuki *viewport*.

### Anotasi 3: Mesin Hitung Mundur (*Countdown Timer*)
* **Normalisasi Tanggal Lintas-Peramban:** Mengonversi pemisah tanda hubung (`-`) menjadi garis miring (`/`) via `cdDate.replace(/-/g, '/')` sebelum diinstansiasi ke objek `new Date()` guna mencegah galat `Invalid Date` / `NaN` pada browser Safari/iOS versi lama.
* **Fallback Kedaluwarsa:** Ketika selisih waktu (`diff <= 0`), interval dihentikan (`clearInterval`) dan kontainer `#countdown-wrapper` digantikan oleh `#countdown-finished`.

### Anotasi 4 & 7: *Slideshow* Otomatis & *Modal Lightbox*
* **`initSlideshow()`:** Mengganti opasitas gambar galeri secara otomatis setiap `3000ms` serta menyinkronkan indikator titik (`.slide-dot`).
* **Kontroler Lightbox (`openLightbox`, `zoomInLightbox`, `playSlideshow`, `toggleFullscreen`):** Menyediakan tampilan pratinjau layar penuh dengan dukungan navigasi keyboard (`ArrowLeft`, `ArrowRight`, `Escape`), perbesaran skala CSS (`scale(1)` hingga `scale(2.2)`), dan *slideshow* modal.

### Anotasi 5 & 8: Amplop Digital, *Clipboard*, & Integrasi Google Sheets API
* **Accordion Amplop (`toggle-gift-btn`):** Mengatur transisi ketinggian dinamis (`scrollHeight`) pada `#gift-cards-container`.
* **Penyalinan Teks (`copyText`):** Menggunakan `targetElement.textContent || targetElement.innerText` untuk memastikan teks tetap terbaca oleh `navigator.clipboard.writeText()` meskipun elemen induk memiliki properti CSS `display: none` (kelas `hidden`).
* **Integrasi RSVP & Ucapan (`fetchWishes` & Form Submit):**
  * Mengirim data formulir melalui `fetch(SCRIPT_URL, { method: 'POST', body: formData, mode: 'no-cors' })`.
  * Mengambil daftar ucapan melalui `fetch(SCRIPT_URL)` metode `GET` berformat JSON.
  * Melakukan sanitasi string input pengguna menggunakan fungsi `escapeHTML()` untuk mencegah kerentanan *Cross-Site Scripting* (XSS).
  * Memiliki *fallback UI* apabila `SCRIPT_URL` kosong agar *loading spinner* tidak berputar tanpa henti.

### Anotasi 6: *3D Envelope Cover* & Kontroler Audio
* **`openInvitation()`:** Memicu kelas `.is-opening` (rotasi 3D *flap* amplop `rotateX(180deg)`), menggeser `#welcome-cover` ke luar *viewport* setelah `2500ms`, melepas kelas `scroll-locked` pada `<body>`, dan memicu pemutaran otomatis elemen `<audio id="bg-music">`.

---

## 5. Arsitektur Styling & Design Tokens

1. **Tailwind CSS CDN & Design Tokens (`index.html`):**
   Konfigurasi warna dan tipografi didefinisikan secara *inline* pada objek `tailwind.config` sehingga kelas utilitas seperti `bg-surface`, `text-primary`, dan `font-display-lg` terikat langsung pada token tema.
2. **Core Layout Engine (`assets/style/style.css`):**
   * **Viewport Locking & Safe-Area:** Menggunakan `height: 100dvh` dan fungsi CSS `env(safe-area-inset-bottom, 16px)` pada kelas `.pb-safe` agar bilah navigasi bawah tidak tertutup *home indicator* pada perangkat seluler modern.
   * **3D Perspective Envelope:** Menggunakan `perspective: 1200px`, `clip-path: polygon(...)`, dan `transform-origin: top` untuk menciptakan simulasi pembukaan amplop fisik tanpa aset gambar eksternal.

---

## 6. Skema URL API & Format Data Eksternal

### A. Skema Google Maps (`acara.akad` & `acara.resepsi`)
* **`mapUrl` (Tautan Eksternal):** URL navigasi standar Google Maps (contoh: `https://maps.app.goo.gl/...` atau `https://maps.google.com/?q=...`).
* **`mapEmbed` (Iframe Source):** Wajib menggunakan endpoint *embed* resmi Google Maps:
  `https://www.google.com/maps/embed?pb=[PROTOBUF_PARAMETERS]`

### B. Skema Video YouTube (`galeri.videoPrewedEmbed`)
* Wajib menggunakan format URL *embed* dengan parameter *autoplay* bisu agar diizinkan oleh kebijakan browser modern:
  `https://www.youtube.com/embed/[VIDEO_ID]?autoplay=1&mute=1&rel=0&modestbranding=1`

### C. Skema Endpoint Google Apps Script (`wishes.sheetUrl`)
* **Endpoint URL:** `https://script.google.com/macros/s/[DEPLOYMENT_ID]/exec`
* **Request `POST` (Multipart FormData):**
  * `Nama` (String, required)
  * `Kehadiran` (String enum: `"Hadir"` | `"Tidak Hadir"`, required)
  * `Pesan` (String, required)
* **Response `GET` (JSON Array):**
  ```json
  [
    {
      "Nama": "Budi Santoso",
      "Kehadiran": "Hadir",
      "Pesan": "Selamat menempuh hidup baru, semoga samawa!"
    }
  ]
  ```

---

## 7. Alur Deployment Produksi & Audit Kesiapan

### Opsi A: Deployment via GitHub Pages (Static Hosting)
1. Pastikan seluruh perubahan kode telah di-*commit* menggunakan standar **Conventional Commits** (`feat:`, `fix:`, `docs:`, `style:`) dan di-*push* ke *branch* `main`.
2. Buka repositori GitHub, masuk ke **Settings > Pages**.
3. Pada bagian **Build and deployment**, pilih Source **Deploy from a branch**, lalu pilih branch **`main`** dan folder **`/ (root)`**.
4. Klik **Save** dan tunggu proses *GitHub Actions* selesai hingga URL produksi aktif dengan sertifikat SSL otomatis.

### Opsi B: Deployment via Hostinger (hPanel / cPanel)
1. Masuk ke dashboard **hPanel Hostinger** pada domain/subdomain klien.
2. Buka **File Manager** dan arahkan ke direktori utama **`public_html/`**.
3. Unggah berkas `index.html` beserta seluruh direktori `assets/` (pastikan struktur folder tidak berubah).
4. Buka menu **Security > SSL**, pastikan sertifikat SSL aktif, dan nyalakan fitur **Force HTTPS Redirect**.

### Checklist Audit Kesiapan Rilis (*Production Readiness Audit*)
Sebelum menyerahkan tautan undangan kepada klien, pastikan seluruh kriteria berikut terpenuhi:
* [x] **Keamanan HTTPS:** Sertifikat SSL aktif dan protokol HTTP otomatis dialihkan ke HTTPS.
* [x] **Zero Console Error:** Tidak ada galat *404 Not Found* pada aset gambar/audio maupun galat skrip pada konsol browser.
* [x] **Performa & Optimasi Aset:** Aset gambar telah dikompresi (skor performa Lighthouse optimal).
* [x] **Responsivitas Lintas Perangkat:** Tata letak telah diverifikasi pada rasio layar *mobile* (`360px - 430px`) dan *desktop* (`>= 1024px`).
* [x] **Fungsionalitas Integrasi:** Peta Google Maps, pemutar audio, *copy* rekening, dan pengiriman ucapan ke Google Sheets berjalan lancar.