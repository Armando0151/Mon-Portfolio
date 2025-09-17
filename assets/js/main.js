// ===== VARIABLES GLOBALES =====
const navbar = document.getElementById("navbar");
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const themeToggle = document.getElementById("themeToggle");
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

// Création des éléments du curseur personnalisé
const cursorDot = document.createElement("div");
const cursorOutline = document.createElement("div");
cursorDot.className = "cursor-dot";
cursorOutline.className = "cursor-outline";
document.body.appendChild(cursorDot);
document.body.appendChild(cursorOutline);
// Toujours visible
cursorDot.style.zIndex = "10000";
cursorOutline.style.zIndex = "10000";
cursorDot.style.background = "var(--primary-color)";
cursorDot.style.border = "2.5px solid #fff";
cursorDot.style.width = "18px";
cursorDot.style.height = "18px";
cursorDot.style.boxShadow = "0 0 0 6px #fff, 0 0 24px 6px var(--primary-color)";
cursorOutline.style.border = "3px solid var(--primary-color)";
cursorOutline.style.background = "rgba(99,102,241,0.12)";
cursorOutline.style.width = "38px";
cursorOutline.style.height = "38px";
cursorOutline.style.boxShadow =
  "0 0 0 10px #fff, 0 0 32px 8px var(--primary-color)";

// Gestion du curseur personnalisé
const cursor = {
  dot: { x: 0, y: 0 },
  outline: { x: 0, y: 0 },
  update: function () {
    this.outline.x += (this.dot.x - this.outline.x) * 0.15;
    this.outline.y += (this.dot.y - this.outline.y) * 0.15;
    cursorOutline.style.transform = `translate(${this.outline.x}px, ${this.outline.y}px)`;
    cursorDot.style.transform = `translate(${this.dot.x}px, ${this.dot.y}px)`;
    requestAnimationFrame(() => this.update());
  },
  init: function () {
    document.addEventListener("mousemove", (e) => {
      this.dot.x = e.clientX;
      this.dot.y = e.clientY;
    });
    this.update();

    // Ajout des effets hover sur les éléments interactifs
    const interactiveElements = document.querySelectorAll(
      "a, button, .nav-link, .project-card, .social-link"
    );
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", () =>
        cursorOutline.classList.add("cursor-hover")
      );
      el.addEventListener("mouseleave", () =>
        cursorOutline.classList.remove("cursor-hover")
      );
    });
  },
};

cursor.init();

// ===== THEME MANAGEMENT =====
class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem("theme") || "light";
    this.init();
  }

  init() {
    this.setTheme(this.theme);
    this.bindEvents();
  }

  setTheme(theme) {
    this.theme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    this.updateThemeIcon();
  }

  toggleTheme() {
    const newTheme = this.theme === "light" ? "dark" : "light";
    this.setTheme(newTheme);
    this.animateThemeTransition();
  }

  updateThemeIcon() {
    const icon = themeToggle.querySelector("i");
    if (this.theme === "light") {
      icon.className = "uil uil-moon";
    } else {
      icon.className = "uil uil-sun";
    }
  }

  animateThemeTransition() {
    document.documentElement.style.transition = "all 0.3s ease";
    setTimeout(() => {
      document.documentElement.style.transition = "";
    }, 300);
  }

  bindEvents() {
    if (themeToggle) {
      themeToggle.addEventListener("click", () => this.toggleTheme());
    }
  }
}

// ===== NAVIGATION MANAGER =====
class NavigationManager {
  constructor() {
    this.isMenuOpen = false;
    this.init();
  }

  init() {
    this.bindEvents();
    this.handleScroll();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    navMenu?.classList.toggle("active", this.isMenuOpen);
    this.animateToggleButton();
  }

  closeMenu() {
    this.isMenuOpen = false;
    navMenu?.classList.remove("active");
    this.animateToggleButton();
  }

  animateToggleButton() {
    const spans = navToggle?.querySelectorAll("span");
    if (!spans) return;

    if (this.isMenuOpen) {
      spans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
      spans[1].style.opacity = "0";
      spans[2].style.transform = "rotate(-45deg) translate(7px, -6px)";
    } else {
      spans[0].style.transform = "rotate(0) translate(0, 0)";
      spans[1].style.opacity = "1";
      spans[2].style.transform = "rotate(0) translate(0, 0)";
    }
  }

  handleScroll() {
    let ticking = false;

    const updateNavbar = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      navbar?.classList.toggle("scrolled", scrollTop > 100);
      ticking = false;
    };

    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    });
  }

  bindEvents() {
    if (navToggle) {
      navToggle.addEventListener("click", () => this.toggleMenu());
    }
    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute("href"));
        if (target) {
          this.smoothScrollTo(target.offsetTop - 100);
          this.closeMenu();
        }
      });
    });
    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!navbar?.contains(e.target) && this.isMenuOpen) {
        this.closeMenu();
      }
    });
  }

  smoothScrollTo(targetPosition) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 800;
    let start = null;

    // Animation des éléments pendant le défilement
    this.animateElementsOnScroll(startPosition, targetPosition);

    const animation = (currentTime) => {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const run = this.easeInOutQuart(
        timeElapsed,
        startPosition,
        distance,
        duration
      );
      window.scrollTo(0, run);
      // Continuer à animer les éléments pendant le défilement
      this.animateElementsOnScroll(run, targetPosition);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    };

    requestAnimationFrame(animation);
  }

  animateElementsOnScroll(currentPosition, targetPosition) {
    const scrollDirection = currentPosition < targetPosition ? "down" : "up";
    const animatedElements = document.querySelectorAll(".fade-scroll");
    animatedElements.forEach((element) => {
      const elementTop = element.offsetTop;
      const elementHeight = element.offsetHeight;
      const windowHeight = window.innerHeight;
      if (scrollDirection === "down") {
        // Défilement vers le bas - apparition des éléments
        if (currentPosition > elementTop - windowHeight + 100) {
          element.classList.add("visible");
          element.classList.remove("hidden");
        }
      } else {
        // Défilement vers le haut - disparition des éléments
        if (currentPosition < elementTop - windowHeight) {
          element.classList.remove("visible");
          element.classList.add("hidden");
        }
      }
    });
  }

  easeInOutQuart(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t * t * t + b;
    t -= 2;
    return (-c / 2) * (t * t * t * t - 2) + b;
  }
}

// ===== TYPING ANIMATION =====

class TypingAnimation {
  constructor(element, texts, options = {}) {
    this.element = element;
    this.texts = texts;
    this.options = {
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000,
      startDelay: 500,
      loop: true,
      ...options,
    };
    this.textIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    this.isWaiting = false;

    this.init();
  }

  init() {
    setTimeout(() => this.type(), this.options.startDelay);
  }

  type() {
    const currentText = this.texts[this.textIndex];

    if (this.isDeleting) {
      this.element.textContent = currentText.substring(0, this.charIndex - 1);
      this.charIndex--;
    } else {
      this.element.textContent = currentText.substring(0, this.charIndex + 1);
      this.charIndex++;
    }

    let typeSpeed = this.isDeleting
      ? this.options.backSpeed
      : this.options.typeSpeed;

    if (!this.isDeleting && this.charIndex === currentText.length) {
      typeSpeed = this.options.backDelay;
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.textIndex = (this.textIndex + 1) % this.texts.length;
      typeSpeed = 500;
    }

    setTimeout(() => this.type(), typeSpeed);
  }
}

// ===== SCROLL ANIMATIONS =====
class ScrollAnimations {
  constructor() {
    this.observer = null;
    this.lastScrollTop = 0;
    this.init();
  }

  init() {
    this.createObserver();
    this.observeElements();
    this.handleScroll = this.handleScroll.bind(this);
    window.addEventListener('scroll', this.handleScroll);
  }

  handleScroll() {
    const st = window.pageYOffset || document.documentElement.scrollTop;
    const scrollingDown = st > this.lastScrollTop;
    this.lastScrollTop = st <= 0 ? 0 : st;
    this.updateElementsVisibility(scrollingDown);
  }

  updateElementsVisibility(scrollingDown) {
    const elements = document.querySelectorAll('.animate-on-scroll');
    const windowHeight = window.innerHeight;
    const buffer = 100; // Zone tampon pour déclencher l'animation

    elements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const elementCenter = rect.top + rect.height / 2;
      const isInView = elementCenter > buffer && elementCenter < windowHeight - buffer;

      if (isInView) {
        element.classList.add('fade-in');
        element.classList.remove('fade-out');
      } else {
        if ((scrollingDown && rect.top > windowHeight) || (!scrollingDown && rect.bottom < 0)) {
          element.classList.add('fade-out');
          element.classList.remove('fade-in');
        }
      }
    });
  }

  createObserver() {
    const options = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-on-scroll');
          const st = window.pageYOffset || document.documentElement.scrollTop;
          const scrollingDown = st > this.lastScrollTop;
          if (scrollingDown) {
            entry.target.classList.add('fade-in');
          }
        }
      });
    }, options);
  }

  observeElements() {
    const animateElements = document.querySelectorAll(`
      .section-header,
      .text-card,
      .skills-category,
      .project-card,
      .info-card,
      .contact-form
    `);

    animateElements.forEach((element, index) => {
      element.style.opacity = "0";
      element.style.transition = "all 0.6s ease";
      element.style.transitionDelay = `${index * 0.1}s`;
      this.observer.observe(element);
    });
  }
}

// ===== FORM HANDLER =====
class FormHandler {
  constructor(formSelector) {
    this.form = document.querySelector(formSelector);
    this.init();
  }

  init() {
    if (!this.form) return;
    this.bindEvents();
    this.setupFloatingLabels();
  }

  bindEvents() {
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));

    // Add input validation
    const inputs = this.form.querySelectorAll(".form-input");
    inputs.forEach((input) => {
      input.addEventListener("blur", () => this.validateField(input));
      input.addEventListener("input", () => this.clearErrors(input));
    });
  }

  setupFloatingLabels() {
    const inputGroups = this.form.querySelectorAll(".input-group");

    inputGroups.forEach((group) => {
      const input = group.querySelector(".form-input");
      const label = group.querySelector(".form-label");

      if (input && label) {
        input.addEventListener("focus", () => {
          label.style.transform = "translateY(-1.5rem) scale(0.875)";
          label.style.color = "var(--primary-color)";
        });

        input.addEventListener("blur", () => {
          if (!input.value) {
            label.style.transform = "translateY(0) scale(1)";
            label.style.color = "var(--text-muted)";
          }
        });

        // Check initial value
        if (input.value) {
          label.style.transform = "translateY(-1.5rem) scale(0.875)";
        }
      }
    });
  }

  validateField(input) {
    const value = input.value.trim();
    let isValid = true;
    let errorMessage = "";

    // Remove existing errors
    this.clearErrors(input);

    // Email validation
    if (input.type === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = "Veuillez entrer une adresse email valide";
      }
    }

    // Required field validation
    if (input.hasAttribute("required") && !value) {
      isValid = false;
      errorMessage = "Ce champ est requis";
    }

    if (!isValid) {
      this.showFieldError(input, errorMessage);
    }

    return isValid;
  }

  showFieldError(input, message) {
    input.style.borderColor = "#ef4444";

    const errorElement = document.createElement("span");
    errorElement.className = "field-error";
    errorElement.textContent = message;
    errorElement.style.color = "#ef4444";
    errorElement.style.fontSize = "0.875rem";
    errorElement.style.marginTop = "0.25rem";
    errorElement.style.display = "block";

    input.parentNode.appendChild(errorElement);
  }

  clearErrors(input) {
    input.style.borderColor = "var(--border-color)";
    const error = input.parentNode.querySelector(".field-error");
    if (error) {
      error.remove();
    }
  }

  async handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData);

    // Validate all fields
    const inputs = this.form.querySelectorAll(".form-input[required]");
    let isFormValid = true;

    inputs.forEach((input) => {
      if (!this.validateField(input)) {
        isFormValid = false;
      }
    });

    if (!isFormValid) return;

    // Show loading state
    const submitBtn = this.form.querySelector(".submit-btn");
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML =
      '<i class="uil uil-spinner-alt"></i> Envoi en cours...';
    submitBtn.disabled = true;

    try {
      // Simulate form submission (replace with actual endpoint)
      await this.simulateSubmission(data);
      this.showSuccessMessage();
      this.form.reset();
    } catch (error) {
      this.showErrorMessage();
    } finally {
      // Restore button
      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 1000);
    }
  }

  async simulateSubmission(data) {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Form data:", data);
        resolve();
      }, 2000);
    });
  }

  showSuccessMessage() {
    this.showNotification(
      "Message envoyé avec succès! Je vous répondrai bientôt.",
      "success"
    );
  }

  showErrorMessage() {
    this.showNotification(
      "Une erreur est survenue. Veuillez réessayer.",
      "error"
    );
  }

  showNotification(message, type) {
    const notification = document.createElement("div");
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
            <i class="uil uil-${
              type === "success" ? "check-circle" : "exclamation-triangle"
            }"></i>
            <span>${message}</span>
        `;

    // Add notification styles
    notification.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            background: ${type === "success" ? "#10b981" : "#ef4444"};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            gap: 0.75rem;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = "slideOutRight 0.3s ease forwards";
      setTimeout(() => notification.remove(), 300);
    }, 4000);
  }
}

// ===== PERFORMANCE OPTIMIZATIONS =====
class PerformanceOptimizer {
  constructor() {
    this.init();
  }

  init() {
    this.optimizeImages();
    this.preloadCriticalResources();
    this.addScrollPerformance();
  }

  optimizeImages() {
    const images = document.querySelectorAll("img");

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute("data-src");
          }
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach((img) => {
      imageObserver.observe(img);
    });
  }

  preloadCriticalResources() {
    const criticalResources = [
      "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap",
      "https://unicons.iconscout.com/release/v4.0.8/css/line.css",
    ];

    criticalResources.forEach((resource) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.href = resource;
      link.as = "style";
      document.head.appendChild(link);
    });
  }

  addScrollPerformance() {
    let ticking = false;

    const optimizedScroll = () => {
      // Throttle scroll events
      if (!ticking) {
        requestAnimationFrame(() => {
          // Scroll-dependent animations go here
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", optimizedScroll, { passive: true });
  }
}

// ===== PARTICLE SYSTEM (Optional Enhancement) =====
class ParticleSystem {
  constructor(container) {
    this.container = container;
    this.particles = [];
    this.animationId = null;
    this.init();
  }

  init() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            opacity: 0.6;
        `;

    this.container.appendChild(this.canvas);
    this.resize();
    this.createParticles();
    this.animate();

    window.addEventListener("resize", () => this.resize());
  }

  resize() {
    this.canvas.width = this.container.offsetWidth;
    this.canvas.height = this.container.offsetHeight;
  }

  createParticles() {
    const particleCount = Math.floor(
      (this.canvas.width * this.canvas.height) / 10000
    );

    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Wrap around edges
      if (particle.x < 0) particle.x = this.canvas.width;
      if (particle.x > this.canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = this.canvas.height;
      if (particle.y > this.canvas.height) particle.y = 0;

      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(99, 102, 241, ${particle.opacity})`;
      this.ctx.fill();
    });

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.canvas) {
      this.canvas.remove();
    }
  }
}

// ===== INITIALIZATION =====
document.addEventListener("DOMContentLoaded", () => {
  const themeManager = new ThemeManager();
  const navigationManager = new NavigationManager();
  const typedTextElement = document.querySelector(".typed-text");
  if (typedTextElement) {
    new TypingAnimation(typedTextElement, [
      "Développeur d’applications modernes",
      "Solutions rapides, fiables et durables",
      "Interfaces performantes et intuitives",
      "Partenaire tech orienté résultats",
    ]);
  }
  new ScrollAnimations();
  new FormHandler(".form");
  new PerformanceOptimizer();
  const heroSection = document.querySelector(".hero-section");
  if (heroSection && window.innerWidth > 1024) {
    new ParticleSystem(heroSection);
  }

  // Appliquer les classes d'animation aux éléments
  document
    .querySelectorAll(
      ".hero-content, .section-header, .text-card, .skills-category, .project-card, .info-card, .contact-form"
    )
    .forEach((el) => {
      el.classList.add("fade-scroll");
    });

  // Observer les éléments pour l'animation au scroll
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        entry.target.classList.remove("hidden");
      } else {
        // Seulement masquer si on scroll vers le haut
        if (window.scrollY < entry.target.offsetTop) {
          entry.target.classList.remove("visible");
          entry.target.classList.add("hidden");
        }
      }
    });
  }, observerOptions);

  document.querySelectorAll(".fade-scroll").forEach((el) => {
    observer.observe(el);
  });
});

// ===== UTILITY FUNCTIONS =====
const utils = {
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  throttle: (func, limit) => {
    let lastFunc;
    let lastRan;
    return function () {
      const context = this;
      const args = arguments;
      if (!lastRan) {
        func.apply(context, args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(function () {
          if (Date.now() - lastRan >= limit) {
            func.apply(context, args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    };
  },

  isInViewport: (element) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },
};

// Export for potential module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    ThemeManager,
    NavigationManager,
    TypingAnimation,
    ScrollAnimations,
    FormHandler,
    PerformanceOptimizer,
    ParticleSystem,
    utils,
  };
}
