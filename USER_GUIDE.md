# 📘 Panduan Operasional & Kustomisasi Admin (`USER_GUIDE.md`)

**Proyek:** Website Undangan Pernikahan Digital  
**Mitra Industri:** UD. Rez Wan Jaya  
**Target Pengguna:** Admin / Pengelola Konten (Non-Teknis)

---

## 1. Pendahuluan & Aturan Keamanan Edit

Dokumen ini disusun sebagai buku panduan praktis bagi tim admin **UD. Rez Wan Jaya** untuk mengganti data klien, foto, lagu latar, serta warna tema undangan pernikahan digital **tanpa perlu mengerti pemrograman rumit**.

Untuk mencegah kerusakan tampilan (*layout*) atau fitur yang macet, kode sumber aplikasi ini telah dibagi menjadi dua zona utama:
* 🟢 **`SAFE TO EDIT` (Area Aman Edit):** Bagian yang memang disediakan untuk diubah oleh admin sesuai data masing-masing pengantin.
* 🔴 **`DO NOT EDIT` (Area Terkunci):** Mesin utama aplikasi (*Core System*). **Dilarang mengubah atau menghapus** kode di dalam area ini.

---

## 2. Pengubahan Data Mempelai & Acara (`assets/script/config.js`)

Seluruh informasi utama undangan terpusat di dalam satu berkas bernama **`config.js`** yang berada di folder `assets/script/config.js`. Anda cukup membuka berkas ini menggunakan editor teks (seperti Notepad, VS Code, atau File Manager Hosting) dan mengubah teks di dalam tanda kutip `""`.

### A. Mengatur Menu yang Ditampilkan (`fitur`)
Ubah nilai menjadi `true` untuk menampilkan bagian tersebut, atau `false` untuk menyembunyikannya dari undangan dan menu navigasi:
```javascript
fitur: {
    home: true,         // Halaman sampul utama
    profile: true,      // Profil mempelai pria & wanita
    schedule: true,     // Jadwal & peta lokasi akad/resepsi
    story: true,        // Perjalanan kisah cinta (Timeline)
    gallery: true,      // Galeri foto & video prewedding
    gift: true,         // Amplop digital & kirim hadiah fisik
    wishes: true,       // Formulir doa & ucapan tamu
    quote: true         // Kutipan ayat/doa penutup
},
```

### B. Mengubah Data Mempelai (`mempelai`)
Perbarui nama panggilan, nama lengkap beserta gelar, urutan anak, serta nama kedua orang tua:
```javascript
mempelai: {
    panggilanSingkat: "Romeo & Juliet",
    panggilanPisah: { wanita: "Juliet", pria: "Romeo" },
    wanita: {
        namaLengkap: "Juliet de Montague, S.E.",
        urutanAnak: "Putri Pertama",
        namaAyah: "Bpk. Romeo de Montague",
        namaIbu: "Ibu Neha Montague",
        foto: "assets/images/wanita.jpg"
    },
    pria: {
        namaLengkap: "Romeo de Montague, S.Kom.",
        urutanAnak: "Putra Bungsu (Ketiga)",
        namaAyah: "Bpk. Romeo de Montague",
        namaIbu: "Ibu Sunita Montague",
        foto: "assets/images/Pria.jpg"
    }
},
```

### C. Mengubah Jadwal, Peta Lokasi & Hitung Mundur (`acara`)
1. **Tanggal & Lokasi:** Ubah teks hari, jam, dan alamat lengkap pada bagian `akad` dan `resepsi`.
2. **Tautan Google Maps (`mapUrl`):** Buka Google Maps, cari lokasi gedung/rumah, klik **Bagikan (Share)**, lalu salin tautan pendeknya ke `mapUrl`.
3. **Peta Sematan (`mapEmbed`):** Pada Google Maps klik **Bagikan > Sematkan peta (Embed a map)**, salin **hanya URL di dalam atribut `src="..."`** (diawali dengan `https://www.google.com/maps/embed?...`).
4. **Pengaturan Hitung Mundur (*Countdown*):**
   * `countdownDate`: Wajib menggunakan format **`YYYY-MM-DD`** (Tahun-Bulan-Tanggal, contoh: `"2025-10-25"`).
   * `countdownTime`: Wajib menggunakan format **`HH:MM:SS`** 24 jam (Jam:Menit:Detik, contoh: `"11:00:00"`).

### D. Mengubah Kisah Cinta (`ceritaCinta`)
Anda dapat menambah atau mengurangi blok cerita di dalam tanda kurung siku `[ ... ]`. Setiap cerita memiliki tanggal, judul, deskripsi, foto, dan kode warna label (`warnaAksen`):
```javascript
ceritaCinta: [
    {
        tanggal: "31 Januari 2021",
        judul: "*Kenalan*",
        deskripsi: "Dibawah pohon cemara taman cempaka menjadi saksi kami dipertemukan.",
        foto: "assets/images/Our Story Perkenalan.jpg",
        warnaAksen: "#3b5998" 
    }
],
```

### E. Mengubah Video & Foto Galeri (`galeri`)
* **`videoPrewedEmbed`:** Buka video YouTube, klik **Bagikan > Sematkan**, lalu salin URL dari atribut `src` (contoh: `https://www.youtube.com/embed/KODE_VIDEO`).
* **`foto`:** Daftarkan semua nama berkas foto galeri yang sudah dimasukkan ke folder `assets/images/`.

### F. Mengubah Rekening Amplop Digital & Alamat Hadiah (`amplop`)
Perbarui nama bank, nomor rekening, nama pemilik rekening, serta detail penerima kado fisik pada bagian `amplop`.

### G. Mengubah Kutipan Penutup (`quote`)
Ubah teks doa/ayat suci pada properti `teks` dan sumber suratnya pada properti `sumber`.

---

## 3. Mengganti Aset Foto & Musik Latar

Seluruh berkas media disimpan di dalam folder `assets/`:
1. **Foto Mempelai & Galeri (`assets/images/`):**
   * Unggah foto klien ke folder `assets/images/`.
   * Pastikan penulisan nama berkas dan ekstensinya (`.jpg`, `.png`, atau `.webp`) di `config.js` **sama persis** (perhatikan huruf besar dan kecil).
   * *Tips Performa:* Kompres ukuran foto (disarankan di bawah **300 KB** per foto atau gunakan format `.webp`) agar halaman undangan terbuka dengan cepat.
2. **Musik Latar (`assets/sounds/`):**
   * Siapkan lagu berformat `.mp3` (disarankan ukuran di bawah **3 MB**).
   * Ganti berkas lama dengan menamainya **`lagu-background.mp3`** di dalam folder `assets/sounds/`.

---

## 4. Mengubah Tema Warna & Teks Pengantar (`index.html`)

### A. Mengubah Tema Warna (*Design Tokens*)
Jika klien menginginkan warna tema selain emas (*gold*), buka berkas **`index.html`** dan cari bagian **`DESIGN TOKENS: GLOBAL THEME VARIABLES`** di baris 17–24:
```html
<script>
  tailwind.config = { 
    darkMode: "class", 
    theme: { 
      extend: { 
        colors: { 
          "surface": "#131313",             /* Warna latar utama (Gelap) */
          "primary": "#d4af37",             /* Warna aksen utama (Emas) */
          "on-surface": "#e4e2e1",          /* Warna teks utama */
          "on-surface-variant": "#d0c5af",  /* Warna teks paragraf/sekunder */
          "surface-container": "#1f2020"    /* Warna latar kotak/kartu */
        },
        fontFamily: { ... }
      } 
    } 
  };
</script>
```
Ganti kode warna Hex (contoh: `#d4af37` menjadi `#e11d48` untuk tema merah mawar) sesuai keinginan klien.

### B. Mengubah Teks Statis Undangan
Buka **`index.html`** dan cari blok komentar bertanda **`<!-- SECTION: ... (SAFE TO EDIT) -->`**. Di dalam area tersebut, Anda bebas mengganti kalimat pengantar seperti *"Dengan memohon rahmat Tuhan, kami mengundang Anda..."* atau *"Maha Suci Allah yang telah menciptakan..."* tanpa mengubah tag pembungkus HTML-nya.

---

## 5. Menghubungkan Buku Tamu ke Google Sheets

Agar tamu dapat mengirim ucapan dan konfirmasi kehadiran (*RSVP*):
1. Buat sebuah **Google Spreadsheet** baru di Google Drive.
2. Pada baris pertama (Header), isi tiga kolom secara berurutan: **`Nama`**, **`Kehadiran`**, **`Pesan`**.
3. Klik menu **Ekstensi (Extensions) > Apps Script**, tempelkan skrip penerima data, lalu klik **Terapkan (Deploy) > Deployment baru (New deployment)**.
4. Pilih jenis **Aplikasi web (Web app)**, atur *Yang memiliki akses* menjadi **Siapa saja (Anyone)**, lalu klik **Terapkan**.
5. Salin **URL Aplikasi Web** yang muncul, lalu tempelkan ke bagian `wishes.sheetUrl` di dalam berkas `assets/script/config.js`.