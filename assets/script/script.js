/* ========================================== */
/* ANOTASI 1: KONTROL MUSIK LATAR (PLAY/PAUSE)*/
/* ========================================== */
let isMusicPlaying = false;

function toggleMusic() {
    const bgMusic = document.getElementById('bg-music');
    const musicIcon = document.getElementById('music-icon');
    
    if (isMusicPlaying) {
        bgMusic.pause();
        musicIcon.innerText = 'volume_off'; 
        musicIcon.classList.remove('spin-icon'); 
    } else {
        bgMusic.play();
        musicIcon.innerText = 'music_note'; 
        musicIcon.classList.add('spin-icon'); 
    }
    isMusicPlaying = !isMusicPlaying;
}

/* ========================================== */
/* ANOTASI 2: PEMBUKAAN AMPLOP & COVER DEPAN  */
/* ========================================== */
function openInvitation() {
    document.getElementById('envelope-wrapper').classList.add('is-opening');
    document.getElementById('cover-hint-1').style.opacity = '0';
    document.getElementById('cover-hint-2').style.opacity = '0';
    
    setTimeout(() => {
        document.getElementById('welcome-cover').classList.add('cover-opened');
        document.body.classList.remove('scroll-locked');
        
        const musicContainer = document.getElementById('music-container');
        if(musicContainer) {
            musicContainer.classList.remove('opacity-0', 'pointer-events-none');
        }
        
        const bgMusic = document.getElementById('bg-music');
        const musicIcon = document.getElementById('music-icon');
        
        if(bgMusic) {
            bgMusic.volume = 1.0;
            bgMusic.play().then(() => {
                isMusicPlaying = true;
                musicIcon.innerText = 'music_note'; 
                musicIcon.classList.add('spin-icon');
            }).catch(err => {
                console.log("Autoplay dicegah browser:", err);
                isMusicPlaying = false;
                musicIcon.innerText = 'volume_off'; 
                musicIcon.classList.remove('spin-icon');
            });
        }
    }, 2500); 
}

/* ========================================== */
/* ANOTASI 3: MODAL LIGHTBOX FOTO FULLSCREEN  */
/* ========================================== */
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
    const fileName = decodeURIComponent(imageSrc).split('/').pop(); 
    let index = galleryImages.findIndex(src => src.includes(fileName));
    if(index === -1) index = 0; 
    
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
    
    lightboxZoomLevel = 1;
    modalImg.style.transform = `scale(${lightboxZoomLevel})`;
    
    modalImg.style.opacity = '0.3';
    setTimeout(() => {
        modalImg.src = galleryImages[currentLightboxIndex];
        modalImg.style.opacity = '1';
    }, 150);

    if(counter) {
        counter.innerText = `${currentLightboxIndex + 1} / ${galleryImages.length}`;
    }
}

function nextLightboxImage(e) {
    if(e) e.stopPropagation(); 
    currentLightboxIndex = (currentLightboxIndex + 1) % galleryImages.length;
    updateLightboxContent();
}

function prevLightboxImage(e) {
    if(e) e.stopPropagation();
    currentLightboxIndex = (currentLightboxIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightboxContent();
}

function closeLightbox(e) {
    if (e && e.target.id !== 'lightbox-bg-area' && e.target.innerText !== 'close') {
        return;
    }
    
    const modal = document.getElementById('lightbox-modal');
    const modalImg = document.getElementById('lightbox-img');
    
    modal.classList.add('opacity-0');
    modalImg.classList.remove('scale-100');
    modalImg.classList.add('scale-95');
    
    clearInterval(lightboxSlideshowInterval);
    document.getElementById('lightbox-play-icon').innerText = 'play_arrow';
    
    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }, 300);
}

function zoomInLightbox() {
    const modalImg = document.getElementById('lightbox-img');
    lightboxZoomLevel += 0.2;
    if (lightboxZoomLevel > 2.2) lightboxZoomLevel = 1; 
    modalImg.style.transform = `scale(${lightboxZoomLevel})`;
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.getElementById('lightbox-modal').requestFullscreen().catch(err => {
            console.log(`Error: ${err.message}`);
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
        }, 2500); 
    } else {
        playIcon.innerText = 'play_arrow';
        clearInterval(lightboxSlideshowInterval);
    }
}

// Navigasi Tombol Panah Keyboard
document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('lightbox-modal');
    if (!modal.classList.contains('hidden')) {
        if (e.key === 'ArrowRight') nextLightboxImage();
        if (e.key === 'ArrowLeft') prevLightboxImage();
        if (e.key === 'Escape') closeLightbox({target: {innerText: 'close'}});
    }
});

/* ========================================== */
/* ANOTASI 4: EFEK EFEK PARTIKEL KUNANG-KUNANG*/
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

    /* ========================================== */
    /* ANOTASI 5: OBSERVER NAVIGASI SCROLL AKTIF */
    /* ========================================== */
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

    /* ========================================== */
    /* ANOTASI 6: LOGIKA TIMER HITUNG MUNDUR      */
    /* ========================================== */
    const HARI_TANGGAL = "2026-10-25"; 
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

    /* ========================================== */
    /* ANOTASI 7: SLIDESHOW GALERI FOTO OTOMATIS  */
    /* ========================================== */
    const slides = document.querySelectorAll('.slide-img');
    const dots = document.querySelectorAll('.slide-dot');
    let currentSlide = 0;

    if (slides.length > 0 && dots.length > 0) {
        slides.forEach((slide, idx) => {
            if(idx !== 0) slide.classList.add('pointer-events-none');
        });
        setInterval(() => {
            slides[currentSlide].classList.remove('opacity-100');
            slides[currentSlide].classList.add('opacity-0', 'pointer-events-none');
            if(dots[currentSlide]){
                dots[currentSlide].classList.remove('bg-primary');
                dots[currentSlide].classList.add('bg-white/30');
            }
            currentSlide = (currentSlide + 1) % slides.length;
            
            slides[currentSlide].classList.remove('opacity-0', 'pointer-events-none');
            slides[currentSlide].classList.add('opacity-100');
            if(dots[currentSlide]){
                dots[currentSlide].classList.remove('bg-white/30');
                dots[currentSlide].classList.add('bg-primary');
            }
        }, 3000); 
    }

    /* ========================================== */
    /* ANOTASI 8: ACCORDION BUKA AMPLOP DIGITAL   */
    /* ========================================== */
    const toggleGiftBtn = document.getElementById('toggle-gift-btn');
    const giftContainer = document.getElementById('gift-cards-container');
    const giftBtnIcon = document.getElementById('gift-btn-icon');
    const giftBtnText = document.getElementById('gift-btn-text');

    if(toggleGiftBtn && giftContainer) {
        toggleGiftBtn.addEventListener('click', () => {
            giftContainer.classList.toggle('is-expanded');
            
            if(giftContainer.classList.contains('is-expanded')) {
                giftContainer.style.maxHeight = giftContainer.scrollHeight + "px";
                giftContainer.style.opacity = "1";
                giftContainer.style.marginTop = "2rem";
                
                giftBtnIcon.innerText = "keyboard_arrow_up";
                giftBtnText.innerText = "Tutup";
                
                setTimeout(() => {
                    if(giftContainer.classList.contains('is-expanded')) {
                        giftContainer.style.maxHeight = "none";
                    }
                }, 700);

            } else {
                giftContainer.style.maxHeight = giftContainer.scrollHeight + "px"; 
                giftContainer.offsetHeight; 
                
                giftContainer.style.maxHeight = "0";
                giftContainer.style.opacity = "0";
                giftContainer.style.marginTop = "0";
                
                giftBtnIcon.innerText = "arrow_right_alt";
                giftBtnText.innerText = "Klik Disini";
            }
        });
    }
});

/* ========================================== */
/* ANOTASI 9: FITUR SALIN TEKS REKENING       */
/* ========================================== */
window.copyText = function(elementId, btnElement) {
    const textToCopy = document.getElementById(elementId).innerText;
    navigator.clipboard.writeText(textToCopy).then(() => {
        const originalHtml = btnElement.innerHTML;
        btnElement.innerHTML = `<span class="material-symbols-outlined text-[16px]">check</span> Tersalin`;
        btnElement.classList.add('text-primary', 'border-primary/50');
        
        setTimeout(() => {
            btnElement.innerHTML = originalHtml;
            btnElement.classList.remove('text-primary', 'border-primary/50');
        }, 2000);
    }).catch(err => {
        console.error('Gagal menyalin teks: ', err);
    });
};

/* ========================================== */
/* ANOTASI 10: FORM UCAPAN & GOOGLE SHEETS    */
/* ========================================== */
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwzOtSPn24AJKMRMuRe7QDYHRRQjWBXjFDqJRUiV8VQP3tD1bxYpFHQb-FxuSFGqTg59Q/exec';

const form = document.getElementById('wishes-form');
const submitBtn = document.getElementById('submit-btn');
const btnText = document.getElementById('btn-text');
const btnLoader = document.getElementById('btn-loader');
const listContainer = document.getElementById('wishes-list');
const loadingIndicator = document.getElementById('wishes-loading');

if (form) {
    form.addEventListener('submit', e => {
        e.preventDefault(); 
        
        let formData = new FormData(form);
        
        btnText.innerText = "Mengirim...";
        btnLoader.classList.remove('hidden');
        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-70', 'cursor-not-allowed');
        
        fetch(SCRIPT_URL, { 
            method: 'POST', 
            body: formData,
            mode: 'no-cors' 
        })
        .then(() => {
            alert("Terima kasih! Pesan dan doa Anda telah berhasil dikirim.");
            form.reset(); 
            fetchWishes(); 
        })
        .catch(error => {
            console.error('Error!', error.message);
            alert('Maaf, terjadi kesalahan pada jaringan. Mohon coba kembali.');
        })
        .finally(() => {
            btnText.innerText = "Kirim Ucapan";
            btnLoader.classList.add('hidden');
            submitBtn.disabled = false;
            submitBtn.classList.remove('opacity-70', 'cursor-not-allowed');
        });
    });
}

function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

function fetchWishes() {
    if(!listContainer) return;
    
    listContainer.classList.add('hidden');
    loadingIndicator.classList.remove('hidden');

    fetch(SCRIPT_URL)
        .then(response => response.json())
        .then(data => {
            listContainer.innerHTML = ''; 
            
            if(Array.isArray(data) && data.length > 0) {
                data.forEach((row, index) => {
                    const nama = escapeHTML(row.Nama) || 'Tamu';
                    const kehadiran = escapeHTML(row.Kehadiran) || '-';
                    const pesan = escapeHTML(row.Pesan) || '';

                    const isHadir = kehadiran === 'Hadir';
                    const badgeClass = isHadir 
                        ? 'bg-[#d4af37]/20 text-primary border-primary/30' 
                        : 'bg-white/5 text-[#b5b0a1] border-white/10';
                    
                    const initial = nama.charAt(0).toUpperCase();
                    const animationDelay = index < 15 ? `animation-delay: ${index * 120}ms` : '';
                    
                    const cardHTML = `
                    <div class="opacity-0 mb-4 p-4 rounded-[20px] bg-[#161616] border border-white/5 shadow-md relative group hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[0_10px_25px_rgba(212,175,55,0.15)] transition-all duration-500 ease-out animate-pop-in" style="${animationDelay}">
                        <div class="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[20px] pointer-events-none"></div>
                        
                        <div class="flex justify-between items-start mb-3 relative z-10">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-full bg-surface border border-primary/30 flex items-center justify-center text-primary font-display-lg font-bold shadow-[0_0_10px_rgba(212,175,55,0.2)]">
                                    ${initial}
                                </div>
                                <h4 class="font-bold text-white text-[15px] font-body-md capitalize tracking-wide">${nama}</h4>
                            </div>
                            <span class="text-[9px] font-bold px-2.5 py-1 rounded-md border ${badgeClass} tracking-widest uppercase shadow-sm mt-1">${kehadiran}</span>
                        </div>
                        
                        <p class="text-on-surface-variant text-xs leading-relaxed font-body-md break-words pl-[52px] relative z-10 italic opacity-90 group-hover:opacity-100 transition-opacity">
                           "${pesan}"
                        </p>
                    </div>
                    `;
                    listContainer.insertAdjacentHTML('beforeend', cardHTML);
                });
            } else {
                listContainer.innerHTML = '<p class="text-center text-xs text-on-surface-variant py-4 italic">Belum ada ucapan. Jadilah yang pertama!</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            listContainer.innerHTML = '<p class="text-xs text-red-400 text-center py-4">Gagal memuat ucapan. Pastikan koneksi internet stabil.</p>';
        })
        .finally(() => {
            loadingIndicator.classList.add('hidden');
            listContainer.classList.remove('hidden');
        });
}

document.addEventListener('DOMContentLoaded', () => {
    fetchWishes();
});