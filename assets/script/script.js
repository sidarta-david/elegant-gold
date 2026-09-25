/* ========================================== */
/* 1. LOGIKA COVER & ANIMASI BUKA AMPLOP      */
/* ========================================== */
function openInvitation() {
    document.getElementById('envelope-wrapper').classList.add('is-opening');
    document.getElementById('cover-hint-1').style.opacity = '0';
    document.getElementById('cover-hint-2').style.opacity = '0';
    
    setTimeout(() => {
        document.getElementById('welcome-cover').classList.add('cover-opened');
        document.body.classList.remove('scroll-locked');
    }, 2500); 
}

/* ========================================== */
/* 2. LOGIKA FOTO FULL SCREEN (LIGHTBOX)      */
/* ========================================== */
// Mendata semua gambar yang bisa di-klik ke lightbox
const galleryImages = [
    "assets/images/Gallery-1.jpg",
    "assets/images/Gallery-2.jpg",
    "assets/images/Gallery-3.jpg",
    "assets/images/Gallery-4.jpg",
    "assets/images/Gallery-5.jpg",
    "assets/images/Gallery-6.jpg",
    "assets/images/Gallery-7.jpg",
    "assets/images/Gallery-8.jpg"
];

let currentLightboxIndex = 0;
let lightboxZoomLevel = 1;
let lightboxSlideshowInterval;

function openLightbox(imageSrc) {
    // Memotong URL browser yang panjang untuk mengambil nama filenya saja (misal: "Gallery-2.jpg")
    const fileName = decodeURIComponent(imageSrc).split('/').pop(); 
    
    // Cari indeks gambar berdasarkan nama file yang presisi
    let index = galleryImages.findIndex(src => src.includes(fileName));
    if(index === -1) index = 0; // Default jika tidak ditemukan
    
    currentLightboxIndex = index;
    updateLightboxContent();

    const modal = document.getElementById('lightbox-modal');
    const modalImg = document.getElementById('lightbox-img');
    
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modalImg.classList.remove('scale-95');
        modalImg.classList.add('scale-100');
    }, 10);
}

function updateLightboxContent() {
    const modalImg = document.getElementById('lightbox-img');
    const counter = document.getElementById('lightbox-counter');
    
    // Reset Zoom setiap ganti gambar
    lightboxZoomLevel = 1;
    modalImg.style.transform = `scale(${lightboxZoomLevel})`;
    
    // Transisi Opacity Halus
    modalImg.style.opacity = '0.3';
    setTimeout(() => {
        modalImg.src = galleryImages[currentLightboxIndex];
        modalImg.style.opacity = '1';
    }, 150);

    // Update Counter (ex: 1 / 8)
    if(counter) {
        counter.innerText = `${currentLightboxIndex + 1} / ${galleryImages.length}`;
    }
}

function nextLightboxImage(e) {
    if(e) e.stopPropagation(); // Mencegah klik menembus ke latar belakang penutup
    currentLightboxIndex = (currentLightboxIndex + 1) % galleryImages.length;
    updateLightboxContent();
}

function prevLightboxImage(e) {
    if(e) e.stopPropagation();
    currentLightboxIndex = (currentLightboxIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightboxContent();
}

function closeLightbox(e) {
    // Hanya tutup jika yang diklik adalah area latar belakang luar gambar atau ikon close
    if (e && e.target.id !== 'lightbox-bg-area' && e.target.innerText !== 'close') {
        return;
    }
    
    const modal = document.getElementById('lightbox-modal');
    const modalImg = document.getElementById('lightbox-img');
    
    modal.classList.add('opacity-0');
    modalImg.classList.remove('scale-100');
    modalImg.classList.add('scale-95');
    
    // Matikan slideshow otomatis jika sedang menyala saat ditutup
    clearInterval(lightboxSlideshowInterval);
    document.getElementById('lightbox-play-icon').innerText = 'play_arrow';
    
    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }, 300);
}

// Fitur Tambahan Top Bar
function zoomInLightbox() {
    const modalImg = document.getElementById('lightbox-img');
    lightboxZoomLevel += 0.2;
    if (lightboxZoomLevel > 2.2) lightboxZoomLevel = 1; // Reset zoom jika terlalu besar
    modalImg.style.transform = `scale(${lightboxZoomLevel})`;
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.getElementById('lightbox-modal').requestFullscreen().catch(err => {
            console.log(`Error attempting to enable full-screen mode: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}

function playSlideshow() {
    const playIcon = document.getElementById('lightbox-play-icon');
    if (playIcon.innerText === 'play_arrow') {
        playIcon.innerText = 'pause';
        lightboxSlideshowInterval = setInterval(() => {
            nextLightboxImage();
        }, 2500); // Ganti gambar setiap 2.5 detik
    } else {
        playIcon.innerText = 'play_arrow';
        clearInterval(lightboxSlideshowInterval);
    }
}

// Navigasi dengan Keyboard (Komputer/Laptop)
document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('lightbox-modal');
    if (!modal.classList.contains('hidden')) {
        if (e.key === 'ArrowRight') nextLightboxImage();
        if (e.key === 'ArrowLeft') prevLightboxImage();
        if (e.key === 'Escape') closeLightbox({target: {innerText: 'close'}});
    }
});


/* ========================================== */
/* 3. LOGIKA UTAMA (Berjalan setelah HTML dimuat)*/
/* ========================================== */
document.addEventListener("DOMContentLoaded", () => {
    
    const container = document.getElementById('mobile-container');
    const sections = document.querySelectorAll('main > section'); 
    const navLinks = document.querySelectorAll('.nav-link');
    
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas ? canvas.getContext('2d') : null;

    const fireflyCanvas = document.getElementById('firefly-canvas');
    const fireflyCtx = fireflyCanvas ? fireflyCanvas.getContext('2d') : null;

    const coverFireflyCanvas = document.getElementById('cover-firefly-canvas');
    const coverFireflyCtx = coverFireflyCanvas ? coverFireflyCanvas.getContext('2d') : null;

    // ==========================================
    // LOGIKA ANIMASI BINTANG BERGERAK (MOBILE)
    // ==========================================
    let particles = [];
    
    function resizeCanvas() {
        if (!canvas || !container) return;
        canvas.width = container.clientWidth;
        canvas.height = container.scrollHeight; 
    }
  
    class Particle {
        constructor() { this.reset(); }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.8 + 0.4;
            this.speedX = (Math.random() - 0.5) * 0.3; 
            this.speedY = Math.random() * -0.4 - 0.1;  
            this.alpha = Math.random() * 0.7 + 0.2;     
            this.alphaSpeed = Math.random() * 0.02 + 0.005; 
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.alpha += this.alphaSpeed;
            if (this.alpha > 1 || this.alpha < 0.2) this.alphaSpeed = -this.alphaSpeed;
            
            if (this.y < 0 || this.x < 0 || this.x > canvas.width) {
                this.y = canvas.height;
                this.x = Math.random() * canvas.width;
            }
        }

        draw() {
            ctx.fillStyle = `rgba(212, 175, 55, ${this.alpha})`; 
            ctx.shadowBlur = 8; 
            ctx.shadowColor = "#d4af37";
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }
  
    function initParticles() {
        if (!canvas || !ctx) return;
        resizeCanvas();
        particles = []; 
        for (let i = 0; i < 75; i++) particles.push(new Particle());
    }
  
    function animateParticles() {
        if(!ctx || !canvas) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animateParticles);
    }

    // ==========================================
    // LOGIKA ANIMASI KUNANG-KUNANG (FLEXIBLE)
    // ==========================================
    let firefliesDesktop = [];
    let firefliesCover = [];

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

    class Firefly {
        constructor(targetCanvas, targetCtx) {
            this.canvas = targetCanvas;
            this.ctx = targetCtx;
            this.reset();
            this.y = Math.random() * this.canvas.height; 
        }
        
        reset() {
            this.x = Math.random() * this.canvas.width;
            this.y = this.canvas.height + 10; 
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
            this.x += Math.sin(this.y * 0.02) * 0.3; 
            this.alpha += this.alphaSpeed;
            
            if (this.alpha > this.baseAlpha + 0.3 || this.alpha < this.baseAlpha - 0.2) {
                this.alphaSpeed = -this.alphaSpeed;
            }

            if(this.alpha < 0) this.alpha = 0;
            if(this.alpha > 1) this.alpha = 1;

            if (this.y < -20) this.reset();
        }
        
        draw() {
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(212, 175, 55, ${this.alpha})`;
            this.ctx.shadowBlur = this.size * 4; 
            this.ctx.shadowColor = "rgba(212, 175, 55, 0.8)";
            this.ctx.fill();
            this.ctx.shadowBlur = 0; 
        }
    }

    function initFireflies() {
        resizeFireflyCanvas();
        if (fireflyCanvas && fireflyCtx) {
            firefliesDesktop = [];
            for (let i = 0; i < 45; i++) firefliesDesktop.push(new Firefly(fireflyCanvas, fireflyCtx));
        }
        if (coverFireflyCanvas && coverFireflyCtx) {
            firefliesCover = [];
            for (let i = 0; i < 60; i++) firefliesCover.push(new Firefly(coverFireflyCanvas, coverFireflyCtx));
        }
    }

    function animateFireflies() {
        if (fireflyCtx && fireflyCanvas) {
            fireflyCtx.clearRect(0, 0, fireflyCanvas.width, fireflyCanvas.height);
            firefliesDesktop.forEach(f => { f.update(); f.draw(); });
        }
        if (coverFireflyCtx && coverFireflyCanvas) {
            coverFireflyCtx.clearRect(0, 0, coverFireflyCanvas.width, coverFireflyCanvas.height);
            firefliesCover.forEach(f => { f.update(); f.draw(); });
        }
        if (fireflyCtx || coverFireflyCtx) requestAnimationFrame(animateFireflies);
    }

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
    // LOGIKA SMOOTH SCROLL & DETEKSI MENU AKTIF
    // ==========================================
    window.moveTo = function(sectionId) {
        const targetElement = document.getElementById(sectionId);
        if (targetElement && container) {
            container.scrollTo({ top: targetElement.offsetTop, behavior: 'smooth' });
        }
    };

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if(href && href.startsWith('#')) {
                e.preventDefault(); 
                window.moveTo(href.substring(1));
            }
        });
    });

    const navObserverOptions = {
        root: container, 
        rootMargin: '-30% 0px -50% 0px', 
        threshold: 0
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                updateActiveNav(entry.target.getAttribute('id'));
            }
        });
    }, navObserverOptions);

    sections.forEach(section => navObserver.observe(section));

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
                if (icon) icon.style.fontVariationSettings = "'FILL' 1";
            } else {
                link.classList.remove('active-menu'); 
                if (!isPcExpand) {
                    link.classList.remove('text-primary');
                    link.classList.add('text-[#8c8577]');
                }
                if (icon) icon.style.fontVariationSettings = "'FILL' 0";
            }
        });
    }

    // ==========================================
    // LOGIKA ANIMASI MUNCUL (FADE-UP) KONTEN
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
                observer.unobserve(entry.target);
            }
        });
    }, animObserverOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => animObserver.observe(el));

    // ==========================================
    // LOGIKA COUNTDOWN TIMER (RESEPSI)
    // ==========================================
    const HARI_TANGGAL = "2025-10-25"; 
    const JAM_ACARA    = "11:00:00";   
    const targetDate = new Date(`${HARI_TANGGAL}T${JAM_ACARA}`).getTime();
    const padZero = (num) => num < 10 ? `0${num}` : num;
    
    const timerInterval = setInterval(() => {
        const now = new Date().getTime();
        const diff = targetDate - now;

        const wrapper = document.getElementById('countdown-wrapper');
        const finishedText = document.getElementById('countdown-finished');
        
        if (diff <= 0) {
            clearInterval(timerInterval);
            if (wrapper) wrapper.classList.add('hidden');
            if (finishedText) finishedText.classList.remove('hidden');
            return;
        }

        const elDays = document.getElementById('cd-days');
        const elHours = document.getElementById('cd-hours');
        const elMins = document.getElementById('cd-minutes');
        const elSecs = document.getElementById('cd-seconds');

        if(elDays) elDays.innerText = padZero(Math.floor(diff / (1000 * 60 * 60 * 24)));
        if(elHours) elHours.innerText = padZero(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
        if(elMins) elMins.innerText = padZero(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
        if(elSecs) elSecs.innerText = padZero(Math.floor((diff % (1000 * 60)) / 1000));
        
    }, 1000);

    // ==========================================
    // LOGIKA SLIDESHOW GALERI FOTO
    // ==========================================
    const slides = document.querySelectorAll('.slide-img');
    const dots = document.querySelectorAll('.slide-dot');
    let currentSlide = 0;

    if (slides.length > 0 && dots.length > 0) {
        
        // PERBAIKAN: Nonaktifkan fungsi klik pada gambar yang tersembunyi di awal
        slides.forEach((slide, idx) => {
            if(idx !== 0) slide.classList.add('pointer-events-none');
        });

        setInterval(() => {
            // Sembunyikan slide saat ini dan nonaktifkan kliknya
            slides[currentSlide].classList.remove('opacity-100');
            slides[currentSlide].classList.add('opacity-0', 'pointer-events-none');
            if(dots[currentSlide]){
                dots[currentSlide].classList.remove('bg-primary');
                dots[currentSlide].classList.add('bg-white/30');
            }
            
            // Pindah ke slide berikutnya
            currentSlide = (currentSlide + 1) % slides.length;
            
            // Tampilkan slide baru dan aktifkan kembali fungsi kliknya
            slides[currentSlide].classList.remove('opacity-0', 'pointer-events-none');
            slides[currentSlide].classList.add('opacity-100');
            if(dots[currentSlide]){
                dots[currentSlide].classList.remove('bg-white/30');
                dots[currentSlide].classList.add('bg-primary');
            }
        }, 3000); 
    }

});