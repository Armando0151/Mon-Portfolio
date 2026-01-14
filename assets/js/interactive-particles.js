/**
 * Interactive Particles Background - v6 (Universe Flow Edition)
 * High-performance HTML5 Canvas implementation with Continuous Autonomous Motion.
 * Features: Flow Field Navigation, Kinetic Elasticity, Chromatic Breathing, Global Persistence.
 */

class ParticleEngine {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: -1000, y: -1000, radius: 300 }; // Out of screen initially
        this.isDarkMode = false;
        this.time = 0;

        // Configuration for "Continuous Life & Cinematic Emotion"
        this.config = {
            particleCount: 160,
            connectionDistance: 130,
            baseSpeed: 0.8, // Faster autonomous movement
            flowSpeed: 0.02,
            mouseForce: 18, // Powerful yet smooth repulsion
            damping: 0.95, // High inertia for "glide"
            colors: {
                light: ['rgba(99, 102, 241', 'rgba(6, 182, 212'],
                dark: ['rgba(129, 140, 248', 'rgba(34, 211, 238']
            }
        };

        this.init();
    }

    init() {
        this.canvas.id = 'particle-canvas';
        this.styleCanvas();
        document.body.appendChild(this.canvas);

        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => this.updateMouse(e));
        window.addEventListener('touchstart', (e) => this.updateMouse(e.touches[0]), { passive: true });

        this.checkTheme();
        const observer = new MutationObserver(() => this.checkTheme());
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

        this.resize();
        this.createParticles();
        this.animate();
    }

    styleCanvas() {
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100vw';
        this.canvas.style.height = '100vh';
        this.canvas.style.zIndex = '-1';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.filter = 'contrast(1.1) brightness(1.1)';
    }

    checkTheme() {
        const theme = document.documentElement.getAttribute('data-theme');
        this.isDarkMode = theme === 'dark';
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        // Don't recreate particles on resize, just let them wrap to new boundaries
    }

    updateMouse(e) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
    }

    createParticles() {
        this.particles = [];
        const count = window.innerWidth < 768 ? this.config.particleCount * 0.6 : this.config.particleCount;

        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 2 + 1,
                baseSize: Math.random() * 2 + 1,
                angle: Math.random() * Math.PI * 2,
                spin: Math.random() * 0.05 - 0.025,
                colorIndex: Math.floor(Math.random() * 2),
                seed: Math.random() * 100,
                brightness: Math.random() // For individual shimmer
            });
        }
    }

    draw() {
        // CINEMATIC TRAILS: Soft clear
        this.ctx.fillStyle = this.isDarkMode ? 'rgba(15, 23, 42, 0.2)' : 'rgba(255, 255, 255, 0.2)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const baseColors = this.isDarkMode ? this.config.colors.dark : this.config.colors.light;
        this.time += 0.01;

        this.particles.forEach(p => {
            // 1. FLOW FIELD (Constant drifting like stars/dust)
            // Mathematical wandering that never stops
            const noise = Math.sin(this.time * 0.5 + p.seed) * Math.cos(this.time * 0.3 + p.seed);
            p.vx += Math.cos(p.angle) * this.config.flowSpeed + noise * 0.05;
            p.vy += Math.sin(p.angle) * this.config.flowSpeed + noise * 0.05;
            p.angle += p.spin;

            // 2. MOUSE INTERACTION (Strong Slalom Effect)
            if (this.mouse.x !== -1000) {
                const dx = this.mouse.x - p.x;
                const dy = this.mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < this.mouse.radius) {
                    const force = (this.mouse.radius - dist) / this.mouse.radius;
                    const strength = force * this.config.mouseForce;

                    // Push away
                    p.vx -= (dx / dist) * strength * 0.04;
                    p.vy -= (dy / dist) * strength * 0.04;

                    // Add subtle vortex swirl around mouse
                    p.vx += (dy / dist) * strength * 0.02;
                    p.vy -= (dx / dist) * strength * 0.02;
                }
            }

            // 3. MOTION & FRICTION
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= this.config.damping;
            p.vy *= this.config.damping;

            // 4. INFINITE LOOP WRAP (Never disappearing)
            if (p.x < -20) p.x = this.canvas.width + 20;
            if (p.x > this.canvas.width + 20) p.x = -20;
            if (p.y < -20) p.y = this.canvas.height + 20;
            if (p.y > this.canvas.height + 20) p.y = -20;

            // 5. ANIMATED RENDERING
            p.brightness = (Math.sin(this.time * 2 + p.seed) + 1) / 2;
            const alpha = 0.3 + p.brightness * 0.5;
            const currentSize = p.baseSize + p.brightness * 0.8;

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);

            this.ctx.shadowBlur = 10 + p.brightness * 5;
            this.ctx.shadowColor = `${baseColors[p.colorIndex]}, 0.5)`;
            this.ctx.fillStyle = `${baseColors[p.colorIndex]}, ${alpha})`;
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        });

        this.connectParticles(baseColors[0]);
    }

    connectParticles(baseColor) {
        const threshold = this.config.connectionDistance;
        this.ctx.lineWidth = 0.8;

        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distSq = dx * dx + dy * dy;

                if (distSq < threshold * threshold) {
                    const dist = Math.sqrt(distSq);
                    const alpha = (1 - (dist / threshold)) * 0.15;
                    this.ctx.strokeStyle = `${baseColor}, ${alpha})`;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            }
        }
    }

    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// Global Initialization - Consistent across all pages
window.addEventListener('DOMContentLoaded', () => {
    window.particleEngine = new ParticleEngine();
});
