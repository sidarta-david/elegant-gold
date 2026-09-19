/* ========================================== */
/* LOGIKA COVER & ANIMASI BUKA AMPLOP         */
/* ========================================== */
// Fungsi ini dipanggil dari event onclick pada tombol segel (hati) di HTML
function openInvitation() {
    // 1. Tambahkan kelas 'is-opening' untuk memicu animasi CSS (amplop terbuka & surat naik)
    document.getElementById('envelope-wrapper').classList.add('is-opening');
    
    // 2. Sembunyikan teks petunjuk secara halus (fade out)
    document.getElementById('cover-hint-1').style.opacity = '0';
    document.getElementById('cover-hint-2').style.opacity = '0';
    
    // 3. Beri jeda 2.5 detik agar animasi amplop selesai, lalu angkat cover ke atas
    setTimeout(() => {
        document.getElementById('welcome-cover').classList.add('cover-opened');
        // Buka kunci scroll halaman agar pengguna bisa mulai menggulir konten
        document.body.classList.remove('scroll-locked');
    }, 2500); 
}

/* ========================================== */
/* LOGIKA FOTO FULL SCREEN (LIGHTBOX)         */
/* ========================================== */
function openLightbox(imageSrc) {
    const modal = document.getElementById('lightbox-modal');
    const modalImg = document.getElementById('lightbox-img');
    
    modalImg.src = imageSrc;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    // Memberi jeda kecil agar transisi opacity CSS berjalan mulus
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modalImg.classList.remove('scale-95');
        modalImg.classList.add('scale-100');
    }, 10);
}

function closeLightbox() {
    const modal = document.getElementById('lightbox-modal');
    const modalImg = document.getElementById('lightbox-img');
    
    modal.classList.add('opacity-0');
    modalImg.classList.remove('scale-100');
    modalImg.classList.add('scale-95');
    
    // Menunggu transisi CSS selesai sebelum menyembunyikan display-nya
    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        modalImg.src = ''; 
    }, 300);
}

/* ========================================== */
/* LOGIKA UTAMA (Berjalan setelah HTML dimuat)*/
/* ========================================== */
document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. INISIALISASI VARIABEL GLOBAL
    // ==========================================
    // Menangkap elemen-elemen utama dari DOM HTML
    const container = document.getElementById('mobile-container');
    const sections = document.querySelectorAll('main > section'); 
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Konfigurasi Canvas untuk animasi Bintang (Mobile)
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas ? canvas.getContext('2d') : null;

    // Konfigurasi Canvas untuk animasi Kunang-kunang (Desktop Kiri)
    const fireflyCanvas = document.getElementById('firefly-canvas');
    const fireflyCtx = fireflyCanvas ? fireflyCanvas.getContext('2d') : null;

    // Konfigurasi Canvas untuk animasi Kunang-kunang (Layar Cover Depan)
    const coverFireflyCanvas = document.getElementById('cover-firefly-canvas');
    const coverFireflyCtx = coverFireflyCanvas ? coverFireflyCanvas.getContext('2d') : null;

    // ==========================================
    // 2. LOGIKA ANIMASI BINTANG BERGERAK (MOBILE)
    // ==========================================
    let particles = [];
    
    // Menyesuaikan ukuran canvas dengan tinggi area scroll kontainer mobile
    function resizeCanvas() {
        if (!canvas || !container) return;
        canvas.width = container.clientWidth;
        canvas.height = container.scrollHeight; 
    }
  
    // Kelas blueprint pembentuk partikel bintang
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            // Posisi awal acak
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.8 + 0.4; // Variasi ukuran bintang
            
            // Kecepatan melayang (X: menyamping, Y: ke atas)
            this.speedX = (Math.random() - 0.5) * 0.3; 
            this.speedY = Math.random() * -0.4 - 0.1;  
            
            // Transparansi untuk efek kelap-kelip
            this.alpha = Math.random() * 0.7 + 0.2;     
            this.alphaSpeed = Math.random() * 0.02 + 0.005; 
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Kalkulasi kelap-kelip (memantulkan nilai alpha jika mencapai batas)
            this.alpha += this.alphaSpeed;
            if (this.alpha > 1 || this.alpha < 0.2) {
                this.alphaSpeed = -this.alphaSpeed;
            }

            // Jika partikel keluar dari layar (atas/kiri/kanan), reset ke bawah
            if (this.y < 0 || this.x < 0 || this.x > canvas.width) {
                this.y = canvas.height;
                this.x = Math.random() * canvas.width;
            }
        }

        draw() {
            ctx.fillStyle = `rgba(212, 175, 55, ${this.alpha})`; 
            ctx.shadowBlur = 8; 
            ctx.shadowColor = "#d4af37"; // Memberikan efek cahaya (*glow*)
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0; // Reset shadow untuk elemen berikutnya
        }
    }
  
    function initParticles() {
        if (!canvas || !ctx) return;
        resizeCanvas();
        particles = []; 
        for (let i = 0; i < 75; i++) { // Membuat 75 partikel bintang
            particles.push(new Particle());
        }
    }
  
    function animateParticles() {
        if(!ctx || !canvas) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Bersihkan frame sebelumnya
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles); // Looping animasi
    }

    // ==========================================
    // 3. LOGIKA ANIMASI KUNANG-KUNANG (FLEXIBLE)
    // ==========================================
    let firefliesDesktop = [];
    let firefliesCover = [];

    // Menyesuaikan ukuran canvas kunang-kunang berdasarkan kontainer induknya
    function resizeFireflyCanvas() {
        if (fireflyCanvas) {
            const parent = fireflyCanvas.parentElement;
            fireflyCanvas.width = parent.clientWidth;
            fireflyCanvas.height = parent.clientHeight;
        }
        if (coverFireflyCanvas) {
            coverFireflyCanvas.width = window.innerWidth;
            coverFireflyCanvas.height = window.innerHeight;
        }
    }

    // Kelas yang dirancang agar bisa digunakan di banyak Canvas berbeda
    class Firefly {
        constructor(targetCanvas, targetCtx) {
            this.canvas = targetCanvas;
            this.ctx = targetCtx;
            this.reset();
            this.y = Math.random() * this.canvas.height; // Sebar acak posisi Y saat inisialisasi
        }
        
        reset() {
            this.x = Math.random() * this.canvas.width;
            this.y = this.canvas.height + 10; // Muncul dari bawah layar
            
            this.size = Math.random() * 4 + 1; 
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() * -0.6) - 0.2; 
            
            this.baseAlpha = Math.random() * 0.6 + 0.2;
            this.alpha = this.baseAlpha;
            this.alphaSpeed = (Math.random() * 0.01) + 0.005; 
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Menambahkan fungsi sinus agar pergerakan X meliuk-liuk (tidak lurus kaku)
            this.x += Math.sin(this.y * 0.02) * 0.3; 

            this.alpha += this.alphaSpeed;
            if (this.alpha > this.baseAlpha + 0.3 || this.alpha < this.baseAlpha - 0.2) {
                this.alphaSpeed = -this.alphaSpeed;
            }

            // Mencegah alpha bocor melebihi batas render visual
            if(this.alpha < 0) this.alpha = 0;
            if(this.alpha > 1) this.alpha = 1;

            // Reset ke bawah jika sudah melewati batas atas layar
            if (this.y < -20) {
                this.reset();
            }
        }
        
        draw() {
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(212, 175, 55, ${this.alpha})`;
            
            this.ctx.shadowBlur = this.size * 4; // Glow disesuaikan dengan ukuran tubuh kunang-kunang
            this.ctx.shadowColor = "rgba(212, 175, 55, 0.8)";
            
            this.ctx.fill();
            this.ctx.shadowBlur = 0; 
        }
    }

    function initFireflies() {
        resizeFireflyCanvas();
        
        // Buat objek kunang-kunang untuk Desktop Kiri
        if (fireflyCanvas && fireflyCtx) {
            firefliesDesktop = [];
            for (let i = 0; i < 45; i++) { 
                firefliesDesktop.push(new Firefly(fireflyCanvas, fireflyCtx));
            }
        }

        // Buat objek kunang-kunang untuk Cover Depan
        if (coverFireflyCanvas && coverFireflyCtx) {
            firefliesCover = [];
            for (let i = 0; i < 60; i++) { 
                firefliesCover.push(new Firefly(coverFireflyCanvas, coverFireflyCtx));
            }
        }
    }

    function animateFireflies() {
        // Render siklus kunang-kunang Desktop
        if (fireflyCtx && fireflyCanvas) {
            fireflyCtx.clearRect(0, 0, fireflyCanvas.width, fireflyCanvas.height);
            firefliesDesktop.forEach(f => {
                f.update();
                f.draw();
            });
        }

        // Render siklus kunang-kunang Cover
        if (coverFireflyCtx && coverFireflyCanvas) {
            coverFireflyCtx.clearRect(0, 0, coverFireflyCanvas.width, coverFireflyCanvas.height);
            firefliesCover.forEach(f => {
                f.update();
                f.draw();
            });
        }
        
        // Ulangi frame animasi terus-menerus
        if (fireflyCtx || coverFireflyCtx) {
            requestAnimationFrame(animateFireflies);
        }
    }

    // ==========================================
    // 4. EKSEKUSI SEMUA CANVAS ANIMASI
    // ==========================================
    // Inisialisasi dan pasang listener agar ukuran canvas menyesuaikan saat layar di-resize
    if (canvas && ctx) {
        initParticles();
        animateParticles();
        window.addEventListener('resize', initParticles);
    }

    if ((fireflyCanvas && fireflyCtx) || (coverFireflyCanvas && coverFireflyCtx)) {
        initFireflies();
        animateFireflies();
        window.addEventListener('resize', initFireflies);
    }

    // ==========================================
    // 5. LOGIKA SMOOTH SCROLL (SAAT MENU DIKLIK)
    // ==========================================
    window.moveTo = function(sectionId) {
        const targetElement = document.getElementById(sectionId);
        if (targetElement && container) {
            container.scrollTo({
                top: targetElement.offsetTop,
                behavior: 'smooth'
            });
        }
    };

    // Mencegah *jump to anchor* default bawaan HTML, menggantinya dengan scroll halus
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if(href && href.startsWith('#')) {
                e.preventDefault(); 
                const targetId = href.substring(1);
                window.moveTo(targetId);
            }
        });
    });

    // ==========================================
    // 6. LOGIKA SCROLLSPY (DETEKSI HALAMAN AKTIF)
    // ==========================================
    const navObserverOptions = {
        root: container, 
        rootMargin: '-30% 0px -50% 0px', // Area sensitif deteksi berada di tengah layar
        threshold: 0
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                updateActiveNav(currentId);
            }
        });
    }, navObserverOptions);

    sections.forEach(section => navObserver.observe(section));

    // Mengganti warna dan transisi ikon menu yang sedang aktif dilihat pengguna
    function updateActiveNav(activeId) {
        navLinks.forEach(link => {
            const icon = link.querySelector('.nav-icon');
            const href = link.getAttribute('href');
            if (!href) return;
            
            const targetId = href.substring(1);
            const isPcExpand = link.classList.contains('pc-expand-link');

            if (targetId === activeId) {
                link.classList.add('active-menu'); 
                
                if (!isPcExpand) {
                    link.classList.add('text-primary');
                    link.classList.remove('text-[#8c8577]');
                }
                
                // Ubah font icon Material Symbol menjadi Solid/Blok
                if (icon) icon.style.fontVariationSettings = "'FILL' 1";
                
            } else {
                link.classList.remove('active-menu'); 
                
                if (!isPcExpand) {
                    link.classList.remove('text-primary');
                    link.classList.add('text-[#8c8577]');
                }
                
                // Kembalikan font icon Material Symbol menjadi Outline/Garis
                if (icon) icon.style.fontVariationSettings = "'FILL' 0";
            }
        });
    }

    // ==========================================
    // 7. LOGIKA ANIMASI MUNCUL (FADE-UP) KONTEN
    // ==========================================
    const animObserverOptions = {
        root: container,
        rootMargin: '0px 0px -10% 0px', 
        threshold: 0.1
    };

    const animObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Lepas observasi agar animasi tidak berulang
            }
        });
    }, animObserverOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => animObserver.observe(el));

    // ==========================================
    // 8. LOGIKA COUNTDOWN TIMER (RESEPSI)
    // ==========================================
    
    // --- PENGATURAN WAKTU ACARA (UBAH DISINI) ---
    const HARI_TANGGAL = "2025-10-25"; // Format: YYYY-MM-DD (Tahun-Bulan-Tanggal)
    const JAM_ACARA    = "11:00:00";   // Format: HH:MM:SS (Jam:Menit:Detik 24 Jam)
    // --------------------------------------------

    // Menggabungkan string konfigurasi dan mendapatkan nilai milidetik (timestamp)
    const targetDate = new Date(`${HARI_TANGGAL}T${JAM_ACARA}`).getTime();
    
    // Utilitas untuk menyisipkan angka nol (0) di depan angka tunggal
    const padZero = (num) => num < 10 ? `0${num}` : num;
    
    const timerInterval = setInterval(() => {
        const now = new Date().getTime();
        const diff = targetDate - now;

        const wrapper = document.getElementById('countdown-wrapper');
        const finishedText = document.getElementById('countdown-finished');
        
        // Logika saat batas waktu telah terlewati
        if (diff <= 0) {
            clearInterval(timerInterval);
            
            // Sembunyikan blok angka, munculkan teks acara dimulai
            if (wrapper) wrapper.classList.add('hidden');
            if (finishedText) finishedText.classList.remove('hidden');
            return;
        }

        // Kalkulasi waktu
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        // Binding HTML
        const elDays = document.getElementById('cd-days');
        const elHours = document.getElementById('cd-hours');
        const elMins = document.getElementById('cd-minutes');
        const elSecs = document.getElementById('cd-seconds');

        if(elDays) elDays.innerText = padZero(days);
        if(elHours) elHours.innerText = padZero(hours);
        if(elMins) elMins.innerText = padZero(minutes);
        if(elSecs) elSecs.innerText = padZero(seconds);
        
    }, 1000);

});