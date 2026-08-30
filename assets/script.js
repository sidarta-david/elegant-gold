document.addEventListener("DOMContentLoaded", () => {
    // 1. Logika Partikel Canvas Latar Belakang
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    const container = document.getElementById('mobile-container');
    const section = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-link");
    
    window.addEventListener("scroll", () => {
    let currentSectionId = "";

    // Memeriksa section mana yang sedang terlihat di layar
        section.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

        // Jika posisi scroll sudah memasuki area section
            if (pageYOffset >= sectionTop - sectionHeight / 3) {
            currentSectionId = section.getAttribute("id");
            }
        });

    // Memperbarui class 'active' pada tombol navigasi
    navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${currentSectionId}`) {
        link.classList.add("active");
        }
    });
    });
    
    let particles = [];
    
    function resizeCanvas() {
        canvas.width = container.clientWidth;
        canvas.height = container.scrollHeight; 
    }
  
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5 + 0.5;
            this.speedY = Math.random() * 0.3 + 0.1;
            this.alpha = Math.random() * 0.5 + 0.2;
        }
        update() {
            this.y -= this.speedY;
            if (this.y < 0) this.y = canvas.height;
        }
        draw() {
            ctx.fillStyle = `rgba(212, 175, 55, ${this.alpha})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
  
    function init() {
        resizeCanvas();
        particles = []; 
        for (let i = 0; i < 60; i++) {
            particles.push(new Particle());
        }
    }
  
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
  
    init();
    animate();
    window.addEventListener('resize', init);

    // 2. Logika Smooth Scroll Saat Menu Diklik
    const allNavLinks = document.querySelectorAll('.nav-link');
    
    allNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); 
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                container.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 3. Logika Intersection Observer untuk Menu Aktif & Animasi Muncul
    const sections = document.querySelectorAll('main > section');
    
    const navObserverOptions = {
        root: container,
        rootMargin: '-20% 0px -60% 0px', 
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

    section.forEach(section => navObserver.observe(section));

    function updateActiveNav(activeId) {
        allNavLinks.forEach(link => {
            const icon = link.querySelector('.nav-icon');
            const targetId = link.getAttribute('href').substring(1);
            const isPcExpand = link.classList.contains('pc-expand-link');

            if (targetId === activeId) {
                // Ketika Section Aktif
                if (isPcExpand) {
                    link.classList.add('active-pc');
                } else {
                    link.classList.add('text-primary');
                    link.classList.remove('text-[#8c8577]');
                }
                if (icon) icon.style.fontVariationSettings = "'FILL' 1";
            } else {
                // Ketika Section Tidak Aktif
                if (isPcExpand) {
                    link.classList.remove('active-pc');
                } else {
                    link.classList.remove('text-primary');
                    link.classList.add('text-[#8c8577]');
                }
                if (icon) icon.style.fontVariationSettings = "'FILL' 0";
            }
        });
    }

    // 4. Observer untuk Animasi Masuk (Fade-up) Elemen Konten
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

