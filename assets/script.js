document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    const container = document.getElementById('mobile-container');
    
    let particles = [];
    
    // Sesuaikan ukuran canvas dengan ukuran container mobile
    function resizeCanvas() {
        canvas.width = container.clientWidth;
        canvas.height = container.scrollHeight; // Mengambil full tinggi scroll
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
            // Jika partikel keluar batas atas, reset ke bawah layar container
            if (this.y < 0) this.y = canvas.height;
        }
        draw() {
            // Menggunakan warna D4AF37 yang dikonversi ke RGBA
            ctx.fillStyle = `rgba(212, 175, 55, ${this.alpha})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
  
    function init() {
        resizeCanvas();
        particles = []; // Bersihkan jika me-resize
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
  
    // Listen resize event dari window, namun kita set ukuran canvas dari container
    window.addEventListener('resize', init);
    // Jika user scroll dan container membesar dynamically, Anda bisa memanggil resizeCanvas()
});