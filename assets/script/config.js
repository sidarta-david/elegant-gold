/* ========================================== */
/* ANOTASI 1: FILE KONFIGURASI TERSENTRALISASI*/
/* ========================================== */
window.WEDDING_CONFIG = {
    // PENGATURAN FITUR MENU (Ubah ke false untuk menyembunyikan menu & halaman)
    fitur: {
        home: true,         // 1. Sampul & Beranda
        profile: true,      // 2. Profil Mempelai
        schedule: true,     // 3. Jadwal & Lokasi Acara (Alamat)
        story: true,        // 4. Kisah Cinta (Our Story)
        gallery: true,      // 5. Galeri Foto & Video
        gift: true,         // 6. Amplop Digital & Kirim Kado
        wishes: true,       // 7. Kirim Doa & Ucapan
        quote: true         // 8. Penutup (Quote)
    },

    // DATA MEMPELAI & ACARA
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
    acara: {
        tanggalSingkat: "25 . 10 . 2025",
        akad: {
            hariTanggal: "Sabtu, 25 Oktober 2025",
            waktu: "Pukul 08:00 - 10:00 WIB",
            tempat: "Masjid Al-Ikhlas, Jl. Melati No. 12, Jakarta Selatan",
            mapUrl: "https://maps.app.goo.gl/85xdrFVL472atpav9",
            mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.8199767311144!2d106.84201827499926!3d-6.2873788615409465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f272762d33a5%3A0xed8fce4828077e80!2sAl-ikhlas!5e0!3m2!1sid!2sid!4v1788429018355!5m2!1sid!2sid"
        },
        resepsi: {
            hariTanggal: "Sabtu, 25 Oktober 2025",
            waktu: "Pukul 11:00 - 14:00 WIB",
            tempat: "Gedung Serbaguna Cempaka, Jl. Cempaka No. 45, Jakarta Selatan",
            mapUrl: "https://maps.app.goo.gl/b27wR1M4gh682hK56",
            mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.6489238451745!2d106.86464287499783!3d-6.1777285605345025!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f4ff08a15ccf%3A0xe4649a3d34cbc941!2sPertamina%20Meeting%20Hall!5e0!3m2!1sen!2sus!4v1788429379237!5m2!1sen!2sus",
            countdownDate: "2025-10-25",
            countdownTime: "11:00:00"
        },
        liveStreamingUrl: "https://www.youtube.com/live/3o7abhf9EAE?si=YhrTZQZhzlxn91sy"
    },

    // OUR STORY (Bisa tambah/hapus gambar & konten)
    ceritaCinta: [
        {
            tanggal: "31 Januari 2021",
            judul: "*Kenalan*",
            deskripsi: "Dibawah pohon cemara taman cempaka menjadi saksi kami dipertemukan.",
            foto: "assets/images/Our Story Perkenalan.jpg",
            warnaAksen: "#3b5998" // Kode warna untuk titik & label tanggal
        },
        {
            tanggal: "31 Maret 2021",
            judul: "*Kencan Pertama*",
            deskripsi: "Canda tawa dan cerita mengalir begitu saja di sudut kafe kota, perlahan menyatukan rasa di hati kami.",
            foto: "assets/images/Our Story Kencan Pertama.jpg",
            warnaAksen: "#d4af37"
        },
        {
            tanggal: "21 Desember 2021",
            judul: "*Tunangan*",
            deskripsi: "Banyaknya persamaan di antara kami menyakinkan niat untuk melangkah ke jenjang yang lebih serius.",
            foto: "assets/images/Our Story Pertunangan.jpg",
            warnaAksen: "#e11d48"
        },
        {
            tanggal: "25 Oktober 2025",
            judul: "*Pernikahan*",
            deskripsi: "Melangkah bersama mengikat janji suci di hadapan Sang Pencipta untuk menua bersama selamanya.",
            foto: "assets/images/Our Story Pernikahan.jpg",
            warnaAksen: "#d4af37"
        }
    ],

    // 5. GALLERY (Ubah Link Youtube & Daftar Foto)
    galeri: {
        videoPrewedEmbed: "https://www.youtube.com/embed/azgjMFLA1YU?autoplay=1&mute=1&rel=0&modestbranding=1",
        foto: [
            "assets/images/Gallery-1.jpg",
            "assets/images/Gallery-2.jpg",
            "assets/images/Gallery-3.jpg",
            "assets/images/Gallery-4.jpg",
            "assets/images/Gallery-5.jpg",
            "assets/images/Gallery-6.jpg",
            "assets/images/Gallery-7.jpg",
            "assets/images/Gallery-8.jpg"
        ]
    },

    // GIFT (Ubah Teks & Isi Rekening/Alamat Kado)
    amplop: {
        teksPengantar: "Doa restu Anda merupakan karunia yang sangat berarti bagi kami, dan jika memberi adalah ungkapan tanda kasih, Anda dapat memberi kado secara cashless.",
        bank: "BCA",
        noRek: "12345678",
        atasNama: "Habib",
        hadiahFisik: {
            penerima: "Habib Yulianto",
            noHp: "1234567890",
            alamat: "Ds Pagu Kec. Wates Kab. Kediri",
            teksCopy: "Habib Yulianto - 1234567890 - Ds Pagu Kec. Wates Kab. Kediri"
        }
    },

    // KIRIM DOA (Ubah Tautan Spreadsheet)
    wishes: {
        sheetUrl: "https://script.google.com/macros/s/AKfycbwzOtSPn24AJKMRMuRe7QDYHRRQjWBXjFDqJRUiV8VQP3tD1bxYpFHQb-FxuSFGqTg59Q/exec"
    },

    // QUOTE (Ubah Kutipan Terakhir)
    quote: {
        teks: `"Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang."`,
        sumber: "( QS. Ar-Rum: 21 )"
    }
};