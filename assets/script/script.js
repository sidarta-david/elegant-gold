document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. INISIALISASI VARIABEL GLOBAL
    // ==========================================
    const container = document.getElementById('mobile-container');
    const sections = document.querySelectorAll('main > section'); // Mengambil semua section di dalam main
    const navLinks = document.querySelectorAll('.nav-link');
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas ? canvas.getContext('2d') : null;

   // ==========================================
    // 2. LOGIKA ANIMASI BINTANG BERGERAK (CANVAS)
    // ==========================================
    let particles = [];
    
    function resizeCanvas() {
        if (!canvas || !container) return;
        canvas.width = container.clientWidth;
        canvas.height = container.scrollHeight; 
    }
  
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.8 + 0.4; // Ukuran variasi bintang
            
            // Membuat pergerakan bintang lebih dinamis (sedikit menyerong & melayang)
            this.speedX = (Math.random() - 0.5) * 0.3; // Bisa bergeser ke kiri/kanan
            this.speedY = Math.random() * -0.4 - 0.1;  // Bergerak perlahan ke atas
            
            this.alpha = Math.random() * 0.7 + 0.2;     // Tingkat Terang (Opacity)
            this.alphaSpeed = Math.random() * 0.02 + 0.005; // Kecepatan kelap-kelip
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Efek Kelap-kelip (Twinkle Effect)
            this.alpha += this.alphaSpeed;
            if (this.alpha > 1 || this.alpha < 0.2) {
                this.alphaSpeed = -this.alphaSpeed;
            }

            // Jika bintang keluar dari layar, reset posisinya ke bawah/atas lagi
            if (this.y < 0 || this.x < 0 || this.x > canvas.width) {
                this.y = canvas.height;
                this.x = Math.random() * canvas.width;
            }
        }

        draw() {
            ctx.fillStyle = `rgba(212, 175, 55, ${this.alpha})`; // Warna Emas Sesuai Tema
            ctx.shadowBlur = 8; // Efek pendaran cahaya (glow) pada bintang
            ctx.shadowColor = "#d4af37";
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0; // Reset shadow agar performa tetap ringan
        }
    }
  
    function initParticles() {
        resizeCanvas();
        particles = []; 
        for (let i = 0; i < 75; i++) { // Jumlah partikel bintang
            particles.push(new Particle());
        }
    }
  
    function animateParticles() {
        if(!ctx || !canvas) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }
  
    if (canvas && ctx) {
        initParticles();
        animateParticles();
        window.addEventListener('resize', initParticles);
    }

    // ==========================================
    // 3. LOGIKA SMOOTH SCROLL (SAAT MENU DIKLIK)
    // ==========================================
    // Fungsi global agar bisa dipanggil lewat onclick="moveTo('...')" di HTML
    window.moveTo = function(sectionId) {
        const targetElement = document.getElementById(sectionId);
        if (targetElement && container) {
            container.scrollTo({
                top: targetElement.offsetTop,
                behavior: 'smooth'
            });
        }
    };

    // Fallback: Fungsi klik untuk elemen <a> yang tidak memakai onclick
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            // Pastikan href valid dan berawalan '#'
            if(href && href.startsWith('#')) {
                e.preventDefault(); 
                const targetId = href.substring(1);
                window.moveTo(targetId);
            }
        });
    });

    // ==========================================
    // 4. LOGIKA SCROLLSPY (DETEKSI HALAMAN AKTIF)
    // Menggunakan IntersectionObserver (Jauh lebih ringan dari onscroll)
    // ==========================================
    const navObserverOptions = {
        root: container, // Pantau scroll yang terjadi di dalam kontainer HP
        rootMargin: '-30% 0px -50% 0px', // Trigger berubah saat section ada di tengah layar
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

    // Pantau setiap section
    sections.forEach(section => navObserver.observe(section));

    function updateActiveNav(activeId) {
        navLinks.forEach(link => {
            const icon = link.querySelector('.nav-icon');
            const href = link.getAttribute('href');
            if (!href) return;
            
            const targetId = href.substring(1);
            const isPcExpand = link.classList.contains('pc-expand-link');

            if (targetId === activeId) {
                // --- KETIKA SECTION AKTIF ---
                link.classList.add('active-menu'); // Tambahkan class pemicu agar menu PC tetap expand (Kunci)
                
                // Styling khusus Mobile Menu (Ubah warna teks ke Emas)
                if (!isPcExpand) {
                    link.classList.add('text-primary');
                    link.classList.remove('text-[#8c8577]');
                }
                
                // Ubah Icon jadi tipe Solid/Fill
                if (icon) icon.style.fontVariationSettings = "'FILL' 1";
                
            } else {
                // --- KETIKA SECTION TIDAK AKTIF ---
                link.classList.remove('active-menu'); // Hapus pengunci menu PC
                
                // Styling khusus Mobile Menu (Ubah warna teks kembali pudar)
                if (!isPcExpand) {
                    link.classList.remove('text-primary');
                    link.classList.add('text-[#8c8577]');
                }
                
                // Ubah Icon jadi tipe Garis/Outline
                if (icon) icon.style.fontVariationSettings = "'FILL' 0";
            }
        });
    }

    // ==========================================
    // 5. LOGIKA ANIMASI MUNCUL (FADE-UP) KONTEN
    // ==========================================
    const animObserverOptions = {
        root: container,
        rootMargin: '0px 0px -10% 0px', // Muncul sedikit sebelum masuk layar
        threshold: 0.1
    };

    const animObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Tambahkan class is-visible untuk memicu CSS transisi
                entry.target.classList.add('is-visible');
                // Hentikan pemantauan agar animasi tidak berulang-ulang
                observer.unobserve(entry.target); 
            }
        });
    }, animObserverOptions);

    // Terapkan ke semua elemen yang memiliki class .animate-on-scroll
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => animObserver.observe(el));

});