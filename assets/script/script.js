document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. INISIALISASI VARIABEL GLOBAL
    // ==========================================
    const container = document.getElementById('mobile-container');
    const sections = document.querySelectorAll('main > section'); 
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Canvas Mobile / Kanan (Bintang Bergerak)
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas ? canvas.getContext('2d') : null;

    // Canvas Desktop / Kiri (Kunang-Kunang / Bokeh)
    const fireflyCanvas = document.getElementById('firefly-canvas');
    const fireflyCtx = fireflyCanvas ? fireflyCanvas.getContext('2d') : null;

    // ==========================================
    // 2. LOGIKA ANIMASI BINTANG BERGERAK (MOBILE)
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
            
            // Pergerakan dinamis
            this.speedX = (Math.random() - 0.5) * 0.3; 
            this.speedY = Math.random() * -0.4 - 0.1;  
            
            this.alpha = Math.random() * 0.7 + 0.2;     
            this.alphaSpeed = Math.random() * 0.02 + 0.005; 
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Efek Kelap-kelip
            this.alpha += this.alphaSpeed;
            if (this.alpha > 1 || this.alpha < 0.2) {
                this.alphaSpeed = -this.alphaSpeed;
            }

            // Reset saat keluar layar
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
        for (let i = 0; i < 75; i++) { 
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

    // ==========================================
    // 3. LOGIKA ANIMASI KUNANG-KUNANG (DESKTOP)
    // ==========================================
    let fireflies = [];

    function resizeFireflyCanvas() {
        if (!fireflyCanvas) return;
        const parent = fireflyCanvas.parentElement;
        fireflyCanvas.width = parent.clientWidth;
        fireflyCanvas.height = parent.clientHeight;
    }

    class Firefly {
        constructor() {
            this.reset();
            this.y = Math.random() * fireflyCanvas.height; 
        }
        
        reset() {
            this.x = Math.random() * fireflyCanvas.width;
            this.y = fireflyCanvas.height + 10; 
            
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

            if (this.y < -20) {
                this.reset();
            }
        }
        
        draw() {
            fireflyCtx.beginPath();
            fireflyCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            fireflyCtx.fillStyle = `rgba(212, 175, 55, ${this.alpha})`;
            
            fireflyCtx.shadowBlur = this.size * 4; 
            fireflyCtx.shadowColor = "rgba(212, 175, 55, 0.8)";
            
            fireflyCtx.fill();
            fireflyCtx.shadowBlur = 0; 
        }
    }

    function initFireflies() {
        if (!fireflyCanvas || !fireflyCtx) return;
        resizeFireflyCanvas();
        fireflies = [];
        for (let i = 0; i < 45; i++) { 
            fireflies.push(new Firefly());
        }
    }

    function animateFireflies() {
        if (!fireflyCtx || !fireflyCanvas) return;
        fireflyCtx.clearRect(0, 0, fireflyCanvas.width, fireflyCanvas.height);
        
        fireflies.forEach(f => {
            f.update();
            f.draw();
        });
        
        requestAnimationFrame(animateFireflies);
    }

    // ==========================================
    // 4. EKSEKUSI SEMUA CANVAS ANIMASI
    // ==========================================
    if (canvas && ctx) {
        initParticles();
        animateParticles();
        window.addEventListener('resize', initParticles);
    }

    if (fireflyCanvas && fireflyCtx) {
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
        rootMargin: '-30% 0px -50% 0px', 
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
                observer.unobserve(entry.target); 
            }
        });
    }, animObserverOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => animObserver.observe(el));

});