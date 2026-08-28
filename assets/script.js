document.addEventListener("DOMContentLoaded", () => {
    // 1. Logika Partikel Canvas
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    const container = document.getElementById('mobile-container');
    
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

    // 2. Logika Scroll Halus untuk Link Navigasi
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

    // 3. Logika Deteksi Halaman (Menu Berubah Warna Sesuai Posisi Scroll)
    const sections = document.querySelectorAll('main > section');
    
    const observerOptions = {
        root: container,
        rootMargin: '-20% 0px -60% 0px', 
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                updateActiveNav(currentId);
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    function updateActiveNav(activeId) {
        allNavLinks.forEach(link => {
            const icon = link.querySelector('.nav-icon');
            const targetId = link.getAttribute('href').substring(1);

            if (targetId === activeId) {
                link.classList.add('text-primary');
                link.classList.remove('text-[#8c8577]');
                if(icon) icon.style.fontVariationSettings = "'FILL' 1";
            } else {
                link.classList.remove('text-primary');
                link.classList.add('text-[#8c8577]');
                if(icon) icon.style.fontVariationSettings = "'FILL' 0";
            }
        });
    }
});
