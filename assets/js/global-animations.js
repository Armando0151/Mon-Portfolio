/**
 * Global Cinematic Orchestration - v1
 * Using Motion One for high-performance immersive animations.
 * Handles: Scroll Reveals, Staggered Entrances, Micro-interactions.
 */

class GlobalAnimations {
    constructor() {
        if (typeof window.motion === 'undefined') {
            console.warn('Motion One not loaded. Global animations skipped.');
            return;
        }
        document.documentElement.classList.add('js-ready');

        this.motion = window.motion;
        this.init();
    }

    init() {
        this.setupScrollReveals();
        this.setupButtonInteractions();
        this.setupStaggeredCards();
        this.setupThemeTransition();
    }

    /**
     * Reveal elements as they enter the viewport with a cinematic feel.
     */
    setupScrollReveals() {
        const { animate, inView, stagger } = this.motion;

        // Sections reveal
        inView('section', (info) => {
            animate(
                info.target,
                { opacity: [0, 1], y: [40, 0], filter: ['blur(10px)', 'blur(0px)'] },
                { duration: 0.9, easing: [0.17, 0.55, 0.55, 1] }
            );

            // Reveal section children with stagger
            const children = info.target.querySelectorAll('.section-subtitle, p, .btn, .skill-tag');
            if (children.length) {
                animate(
                    children,
                    { opacity: [0, 1], y: [20, 0] },
                    { delay: stagger(0.1, { start: 0.2 }), duration: 0.6 }
                );
            }
        });

        // Reveal footer
        inView('footer', (info) => {
            animate(
                info.target,
                { opacity: [0, 1], scale: [0.98, 1] },
                { duration: 1.2, easing: "ease-out" }
            );
        });
    }

    /**
     * Advanced spring-based micro-interactions for buttons.
     */
    setupButtonInteractions() {
        const { animate } = this.motion;
        const buttons = document.querySelectorAll('.btn, .social-icon, .nav-link');

        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                animate(btn,
                    { scale: 1.05, y: -2 },
                    { type: 'spring', stiffness: 400, damping: 10 }
                );
            });

            btn.addEventListener('mouseleave', () => {
                animate(btn,
                    { scale: 1, y: 0 },
                    { type: 'spring', stiffness: 400, damping: 10 }
                );
            });

            btn.addEventListener('mousedown', () => {
                animate(btn, { scale: 0.95 }, { duration: 0.1 });
            });

            btn.addEventListener('mouseup', () => {
                animate(btn, { scale: 1.05 }, { duration: 0.1 });
            });
        });
    }

    /**
     * Staggered reveal for grid items (projects, services, etc.)
     */
    setupStaggeredCards() {
        const { animate, inView, stagger } = this.motion;
        const grids = document.querySelectorAll('.projects-grid, .education-items, .experience-items');

        grids.forEach(grid => {
            inView(grid, () => {
                const items = Array.from(grid.children);
                if (items.length) {
                    animate(
                        items,
                        { opacity: [0, 1], y: [30, 0], scale: [0.95, 1] },
                        { delay: stagger(0.15), duration: 0.8, easing: [0.2, 0.8, 0.2, 1] }
                    );
                }
            });
        });
    }

    /**
     * Safety fallback: Reveal everything if animations didn't trigger
     */
    setupSafetyFallback() {
        setTimeout(() => {
            document.querySelectorAll('section, footer, .projects-grid > *').forEach(el => {
                if (window.getComputedStyle(el).opacity === "0") {
                    this.motion.animate(el, { opacity: 1 }, { duration: 0.5 });
                }
            });
        }, 3000);
    }

    /**
     * Smooth orchestration during theme changes.
     */
    setupThemeTransition() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;

        themeToggle.addEventListener('click', () => {
            this.motion.animate(
                document.body,
                { opacity: [0.8, 1], filter: ['blur(2px)', 'blur(0px)'] },
                { duration: 0.4 }
            );
        });
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    window.globalAnimations = new GlobalAnimations();
    // Start safety fallback
    window.globalAnimations.setupSafetyFallback();
});
