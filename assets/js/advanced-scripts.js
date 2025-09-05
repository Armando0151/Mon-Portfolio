// ===== ADVANCED PORTFOLIO SCRIPTS =====
// File: assets/js/advanced-scripts.js

// ===== ADVANCED CURSOR SYSTEM =====
class AdvancedCursor {
  constructor() {
    this.dot = null;
    this.outline = null;
    this.mouseX = 0;
    this.mouseY = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.isMoving = false;
    this.moveTimeout = null;
    
    this.init();
  }

  init() {
    // Only initialize on desktop
    if (window.innerWidth <= 768) return;
    
    this.createCursor();
    this.bindEvents();
    this.animate();
  }

  createCursor() {
    // Remove existing cursors if any
    const existingDot = document.querySelector('.cursor-dot');
    const existingOutline = document.querySelector('.cursor-outline');
    
    if (existingDot) existingDot.remove();
    if (existingOutline) existingOutline.remove();

    // Create new cursor elements
    this.dot = document.createElement('div');
    this.dot.className = 'cursor-dot';
    
    this.outline = document.createElement('div');
    this.outline.className = 'cursor-outline';
    
    document.body.appendChild(this.dot);
    document.body.appendChild(this.outline);
    
    // Hide default cursor
    document.body.style.cursor = 'none';
  }

  bindEvents() {
    // Mouse move
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
      this.isMoving = true;
      
      clearTimeout(this.moveTimeout);
      this.moveTimeout = setTimeout(() => {
        this.isMoving = false;
      }, 100);
    });

    // Hover effects for interactive elements
    const interactiveElements = document.querySelectorAll(`
      a, button, .nav-link, .project-card, .social-link,
      .btn-primary, .btn-secondary, .submit-btn, .cv-btn,
      .theme-toggle, .nav-toggle, input, textarea, select
    `);

    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
        this.addHoverEffect();
      });
      
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
        this.removeHoverEffect();
      });
      
      el.addEventListener('mousedown', () => {
        document.body.classList.add('cursor-click');
      });
      
      el.addEventListener('mouseup', () => {
        document.body.classList.remove('cursor-click');
      });
    });

    // Hide cursor when leaving viewport
    document.addEventListener('mouseleave', () => {
      this.dot.style.opacity = '0';
      this.outline.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      this.dot.style.opacity = '1';
      this.outline.style.opacity = '1';
    });
  }

  addHoverEffect() {
    this.dot.style.transform = `translate(${this.mouseX}px, ${this.mouseY}px) scale(1.5)`;
  }

  removeHoverEffect() {
    this.dot.style.transform = `translate(${this.currentX}px, ${this.currentY}px) scale(1)`;
  }

  animate() {
    // Smooth following animation
    const speed = 0.15;
    
    this.currentX += (this.mouseX - this.currentX) * speed;
    this.currentY += (this.mouseY - this.currentY) * speed;
    
    if (this.dot && this.outline) {
      // Update dot position (instant)
      this.dot.style.left = this.mouseX + 'px';
      this.dot.style.top = this.mouseY + 'px';
      
      // Update outline position (delayed)
      this.outline.style.left = this.currentX + 'px';
      this.outline.style.top = this.currentY + 'px';
    }
    
    requestAnimationFrame(() => this.animate());
  }
}

// ===== PAGE LOADER =====
class PageLoader {
  constructor() {
    this.loader = null;
    this.init();
  }

  init() {
    this.createLoader();
    this.showLoader();
    
    // Hide loader when page is loaded
    if (document.readyState === 'complete') {
      setTimeout(() => this.hideLoader(), 800);
    } else {
      window.addEventListener('load', () => {
        setTimeout(() => this.hideLoader(), 800);
      });
    }
  }

  createLoader() {
    this.loader = document.createElement('div');
    this.loader.className = 'page-loader';
    this.loader.innerHTML = '<div class="loader"></div>';
    document.body.appendChild(this.loader);
  }

  showLoader() {
    if (this.loader) {
      this.loader.style.display = 'flex';
      document.body.classList.add('cursor-loading');
    }
  }

  hideLoader() {
    if (this.loader) {
      this.loader.classList.add('loaded');
      document.body.classList.remove('cursor-loading');
      
      setTimeout(() => {
        this.loader.remove();
      }, 500);
    }
  }
}

// ===== ENHANCED SCROLL MANAGER =====
class EnhancedScrollManager {
  constructor() {
    this.scrollToTopBtn = null;
    this.scrollToBottomBtn = null;
    this.isScrolling = false;
    this.init();
  }

  init() {
    this.createScrollButtons();
    this.bindEvents();
    this.updateScrollButtons();
  }

  createScrollButtons() {
    // Create scroll to top button
    this.scrollToTopBtn = document.createElement('button');
    this.scrollToTopBtn.className = 'scroll-btn scroll-to-top';
    this.scrollToTopBtn.innerHTML = '<i class="uil uil-arrow-up"></i>';
    this.scrollToTopBtn.title = 'Remonter en haut';
    
    // Create scroll to bottom button
    this.scrollToBottomBtn = document.createElement('button');
    this.scrollToBottomBtn.className = 'scroll-btn scroll-to-bottom';
    this.scrollToBottomBtn.innerHTML = '<i class="uil uil-arrow-down"></i>';
    this.scrollToBottomBtn.title = 'Descendre en bas';
    
    document.body.appendChild(this.scrollToTopBtn);
    document.body.appendChild(this.scrollToBottomBtn);
  }

  bindEvents() {
    // Scroll to top
    this.scrollToTopBtn.addEventListener('click', () => {
      this.smoothScrollTo(0);
    });

    // Scroll to bottom
    this.scrollToBottomBtn.addEventListener('click', () => {
      this.smoothScrollTo(document.documentElement.scrollHeight);
    });

    // Update button visibility on scroll
    window.addEventListener('scroll', utils.throttle(() => {
      this.updateScrollButtons();
    }, 100));
  }

  updateScrollButtons() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;
    
    // Show/hide scroll to top button
    if (scrollTop > 300) {
      this.scrollToTopBtn.classList.add('visible');
    } else {
      this.scrollToTopBtn.classList.remove('visible');
    }
    
    // Show/hide scroll to bottom button
    if (scrollTop + clientHeight < scrollHeight - 100) {
      this.scrollToBottomBtn.style.opacity = '1';
    } else {
      this.scrollToBottomBtn.style.opacity = '0.3';
    }
  }

  smoothScrollTo(target) {
    if (this.isScrolling) return;
    
    this.isScrolling = true;
    const startPosition = window.pageYOffset;
    const distance = target - startPosition;
    const duration = Math.min(Math.abs(distance) / 2, 1500); // Max 1.5s
    let start = null;

    const animation = (currentTime) => {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const run = this.easeInOutCubic(timeElapsed, startPosition, distance, duration);
      
      window.scrollTo(0, run);
      
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      } else {
        this.isScrolling = false;
      }
    };

    requestAnimationFrame(animation);
  }

  easeInOutCubic(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t * t + b;
    t -= 2;
    return c / 2 * (t * t * t + 2) + b;
  }
}

// ===== ENHANCED THEME MANAGER =====
class EnhancedThemeManager {
  constructor() {
    this.theme = localStorage.getItem('theme') || 'light';
    this.init();
  }

  init() {
    this.setTheme(this.theme);
    this.bindEvents();
    this.updateAnimations();
  }

  setTheme(theme) {
    this.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    this.updateThemeIcon();
    this.animateThemeTransition();
  }

  toggleTheme() {
    const newTheme = this.theme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  updateThemeIcon() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      const icon = themeToggle.querySelector('i');
      if (icon) {
        icon.className = this.theme === 'light' ? 'uil uil-moon' : 'uil uil-sun';
      }
    }
  }

  animateThemeTransition() {
    document.documentElement.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    setTimeout(() => {
      document.documentElement.style.transition = '';
    }, 400);
  }

  updateAnimations() {
    // Update background animations based on theme
    const bgElements = document.querySelectorAll('.bg-element');
    bgElements.forEach(element => {
      if (this.theme === 'dark') {
        element.style.filter = 'blur(40px) brightness(1.2)';
      } else {
        element.style.filter = 'blur(40px) brightness(1)';
      }
    });
  }

  bindEvents() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggleTheme());
    }
  }
}

// ===== ENHANCED NAVIGATION MANAGER =====
class EnhancedNavigationManager {
  constructor() {
    this.navbar = document.getElementById('navbar');
    this.navToggle = document.getElementById('navToggle');
    this.navMenu = document.getElementById('navMenu');
    this.isMenuOpen = false;
    this.activeSection = '';
    
    this.init();
  }

  init() {
    this.bindEvents();
    this.updateActiveSection();
    this.enhanceNavbar();
  }

  bindEvents() {
    // Mobile menu toggle
    if (this.navToggle) {
      this.navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMenu();
      });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isMenuOpen && !this.navbar?.contains(e.target)) {
        this.closeMenu();
      }
    });

    // Prevent menu close when clicking inside menu
    if (this.navMenu) {
      this.navMenu.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }

    // Enhanced scroll behavior
    window.addEventListener('scroll', utils.throttle(() => {
      this.updateNavbarOnScroll();
      this.updateActiveSection();
    }, 16));

    // Smooth scroll for nav links
    this.enhanceNavLinks();

    // Escape key to close menu
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMenuOpen) {
        this.closeMenu();
      }
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    
    if (this.isMenuOpen) {
      this.openMenu();
    } else {
      this.closeMenu();
    }
  }

  openMenu() {
    this.isMenuOpen = true;
    this.navMenu?.classList.add('active');
    this.animateHamburger(true);
    
    // Animate menu items
    const navLinks = this.navMenu?.querySelectorAll('.nav-link');
    navLinks?.forEach((link, index) => {
      link.style.animationDelay = `${index * 0.1}s`;
      link.style.animation = 'slideInLeft 0.4s ease forwards';
    });

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  closeMenu() {
    this.isMenuOpen = false;
    this.navMenu?.classList.remove('active');
    this.animateHamburger(false);
    
    // Restore body scroll
    document.body.style.overflow = '';
  }

  animateHamburger(isOpen) {
    const spans = this.navToggle?.querySelectorAll('span');
    if (!spans) return;

    if (isOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[1].style.transform = 'translateX(-10px)';
      spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
      spans[0].style.transform = 'rotate(0) translate(0, 0)';
      spans[1].style.opacity = '1';
      spans[1].style.transform = 'translateX(0)';
      spans[2].style.transform = 'rotate(0) translate(0, 0)';
    }
  }

  updateNavbarOnScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
      this.navbar?.classList.add('scrolled');
    } else {
      this.navbar?.classList.remove('scrolled');
    }
  }

  updateActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollTop = window.pageYOffset + 150;
    
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (scrollTop >= sectionTop && scrollTop <= sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    if (current !== this.activeSection) {
      this.activeSection = current;
      this.highlightActiveLink();
    }
  }

  highlightActiveLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${this.activeSection}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  enhanceNavLinks() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
          this.closeMenu();
          
          // Smooth scroll with offset
          const offsetTop = targetSection.offsetTop - 100;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  enhanceNavbar() {
    // Add subtle parallax effect to navbar
    window.addEventListener('scroll', utils.throttle(() => {
      const scrollTop = window.pageYOffset;
      const parallaxValue = scrollTop * 0.1;
      
      if (this.navbar) {
        this.navbar.style.transform = `translateX(-50%) translateY(${Math.min(parallaxValue, 10)}px)`;
      }
    }, 16));
  }
}

// ===== ENHANCED ANIMATIONS MANAGER =====
class EnhancedAnimationsManager {
  constructor() {
    this.observedElements = new Set();
    this.observer = null;
    this.init();
  }

  init() {
    this.createObserver();
    this.observeElements();
    this.addParallaxEffects();
  }

  createObserver() {
    const options = {
      threshold: [0.1, 0.25, 0.5, 0.75],
      rootMargin: '-50px 0px -50px 0px'
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const element = entry.target;
        
        if (entry.isIntersecting) {
          this.animateIn(element, entry.intersectionRatio);
        } else {
          this.animateOut(element);
        }
      });
    }, options);
  }

  observeElements() {
    const elements = document.querySelectorAll(`
      .hero-content > *,
      .section-header,
      .text-card,
      .skills-category,
      .project-card,
      .info-card,
      .contact-form,
      .hero-image
    `);

    elements.forEach((element, index) => {
      // Add initial state
      element.style.opacity = '0';
      element.style.transform = 'translateY(60px)';
      element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      element.style.transitionDelay = `${index * 0.1}s`;
      
      this.observer.observe(element);
      this.observedElements.add(element);
    });
  }

  animateIn(element, ratio) {
    const delay = element.dataset.delay || 0;
    
    setTimeout(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
      
      // Add special effects based on element type
      if (element.classList.contains('project-card')) {
        element.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.1)';
      }
      
      if (element.classList.contains('hero-image')) {
        element.style.transform = 'translateY(0) scale(1)';
      }
    }, delay);
  }

  animateOut(element) {
    // Only animate out if scrolling up quickly
    const scrollDirection = this.getScrollDirection();
    if (scrollDirection === 'up') {
      element.style.opacity = '0.3';
      element.style.transform = 'translateY(20px)';
    }
  }

  getScrollDirection() {
    const currentScrollY = window.pageYOffset;
    const direction = currentScrollY > (this.lastScrollY || 0) ? 'down' : 'up';
    this.lastScrollY = currentScrollY;
    return direction;
  }

  addParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.hero-image, .floating-elements');
    
    window.addEventListener('scroll', utils.throttle(() => {
      const scrollTop = window.pageYOffset;
      
      parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(scrollTop * speed);
        element.style.transform = `translate3d(0, ${yPos}px, 0)`;
      });
    }, 16));
  }
}

// ===== ENHANCED FORM MANAGER =====
class EnhancedFormManager {
  constructor() {
    this.form = document.querySelector('.form');
    this.inputs = [];
    this.init();
  }

  init() {
    if (!this.form) return;
    
    this.enhanceInputs();
    this.bindEvents();
    this.addValidation();
  }

  enhanceInputs() {
    const inputs = this.form.querySelectorAll('.form-input');
    
    inputs.forEach(input => {
      this.inputs.push(input);
      
      // Add floating label effect
      const inputGroup = input.closest('.input-group');
      const label = inputGroup?.querySelector('.form-label');
      
      if (label && inputGroup) {
        this.setupFloatingLabel(input, label);
      }
      
      // Add focus effects
      input.addEventListener('focus', () => {
        input.style.borderColor = 'var(--primary-color)';
        input.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
      });
      
      input.addEventListener('blur', () => {
        if (!input.value) {
          input.style.borderColor = 'var(--border-color)';
          input.style.boxShadow = 'none';
        }
      });
    });
  }

  setupFloatingLabel(input, label) {
    const checkValue = () => {
      if (input.value || input === document.activeElement) {
        label.style.transform = 'translateY(-1.8rem) scale(0.85)';
        label.style.color = 'var(--primary-color)';
        label.style.backgroundColor = 'var(--bg-primary)';
        label.style.padding = '0 0.5rem';
      } else {
        label.style.transform = 'translateY(0) scale(1)';
        label.style.color = 'var(--text-muted)';
        label.style.backgroundColor = 'transparent';
        label.style.padding = '0';
      }
    };
    
    input.addEventListener('input', checkValue);
    input.addEventListener('focus', checkValue);
    input.addEventListener('blur', checkValue);
    
    // Initial check
    checkValue();
  }

  bindEvents() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  }

  addValidation() {
    this.inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateInput(input));
      input.addEventListener('input', () => this.clearErrors(input));
    });
  }

  validateInput(input) {
    const value = input.value.trim();
    const inputGroup = input.closest('.input-group');
    let isValid = true;
    let message = '';
    
    // Clear previous errors
    this.clearErrors(input);
    
    // Required validation
    if (input.hasAttribute('required') && !value) {
      isValid = false;
      message = 'Ce champ est requis';
    }
    
    // Email validation
    if (input.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        message = 'Adresse email invalide';
      }
    }
    
    if (!isValid) {
      this.showError(input, message);
    }
    
    return isValid;
  }

  showError(input, message) {
    const inputGroup = input.closest('.input-group');
    
    input.style.borderColor = '#ef4444';
    input.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
    
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.cssText = `
      color: #ef4444;
      font-size: 0.875rem;
      margin-top: 0.25rem;
      opacity: 0;
      transform: translateY(-10px);
      transition: all 0.3s ease;
    `;
    
    inputGroup.appendChild(errorElement);
    
    // Animate in
    requestAnimationFrame(() => {
      errorElement.style.opacity = '1';
      errorElement.style.transform = 'translateY(0)';
    });
  }

  clearErrors(input) {
    const inputGroup = input.closest('.input-group');
    const errorMessage = inputGroup.querySelector('.error-message');
    
    if (errorMessage) {
      errorMessage.remove();
    }
    
    input.style.borderColor = 'var(--border-color)';
    input.style.boxShadow = 'none';
  }

  async handleSubmit() {
    const submitBtn = this.form.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    // Validate all inputs
    let isFormValid = true;
    this.inputs.forEach(input => {
      if (!this.validateInput(input)) {
        isFormValid = false;
      }
    });
    
    if (!isFormValid) return;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="uil uil-spinner-alt" style="animation: spin 1s linear infinite;"></i> Envoi en cours...';
    submitBtn.disabled = true;
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      this.showNotification('Message envoyé avec succès!', 'success');
      this.form.reset();
      
      // Reset floating labels
      this.inputs.forEach(input => {
        const inputGroup = input.closest('.input-group');
        const label = inputGroup?.querySelector('.form-label');
        if (label) {
          label.style.transform = 'translateY(0) scale(1)';
          label.style.color = 'var(--text-muted)';
        }
      });
      
    } catch (error) {
      this.showNotification('Erreur lors de l\'envoi', 'error');
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  }

  showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <i class="uil uil-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
      <span>${message}</span>
    `;
    
    notification.style.cssText = `
      position: fixed;
      top: 2rem;
      right: 2rem;
      background: ${type === 'success' ? '#10b981' : '#ef4444'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      display: flex;
      align-items: center;
      gap: 0.75rem;
      z-index: 10000;
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateX(0)';
    });
    
    // Auto remove
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => notification.remove(), 400);
    }, 4000);
  }
}

// ===== PERFORMANCE OPTIMIZER =====
class PerformanceOptimizer {
  constructor() {
    this.init();
  }

  init() {
    this.optimizeImages();
    this.addPreloading();
    this.debounceResizeEvents();
  }

  optimizeImages() {
    const images = document.querySelectorAll('img[src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          // Add loading animation
          img.style.transition = 'opacity 0.5s ease';
          img.style.opacity = '0';
          
          const newImg = new Image();
          newImg.onload = () => {
            img.style.opacity = '1';
          };
          newImg.src = img.src;
          
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  }

  addPreloading() {
    // Preload critical resources
    const criticalResources = [
      'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
    ];
    
    criticalResources.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = url;
      document.head.appendChild(link);
    });
  }

  debounceResizeEvents() {
    let resizeTimeout;
    
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        // Reinitialize cursor on mobile/desktop switch
        if (window.innerWidth <= 768) {
          document.body.style.cursor = 'auto';
          const cursors = document.querySelectorAll('.cursor-dot, .cursor-outline');
          cursors.forEach(cursor => cursor.style.display = 'none');
        } else {
          // Reinitialize cursor for desktop
          if (window.advancedCursor) {
            window.advancedCursor.init();
          }
        }
      }, 250);
    });
  }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all advanced features
  const pageLoader = new PageLoader();
  const enhancedTheme = new EnhancedThemeManager();
  const enhancedNav = new EnhancedNavigationManager();
  const enhancedAnimations = new EnhancedAnimationsManager();
  const enhancedForm = new EnhancedFormManager();
  const enhancedScroll = new EnhancedScrollManager();
  const performanceOptimizer = new PerformanceOptimizer();
  
  // Initialize cursor only on desktop
  if (window.innerWidth > 768) {
    window.advancedCursor = new AdvancedCursor();
  }
  
  // Add smooth page transitions
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  }, 100);
});

// ===== UTILITY ENHANCEMENTS =====
const utils = {
  ...utils,
  
  // Enhanced throttle
  throttle: (func, limit) => {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  },
  
  // Enhanced debounce
  debounce: (func, wait, immediate) => {
    let timeout;
    return function() {
      const context = this, args = arguments;
      const later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  },
  
  // Smooth scroll utility
  smoothScrollTo: (element, offset = 0) => {
    const targetPosition = element.offsetTop - offset;
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
};
