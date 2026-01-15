/**
 * Portfolio Site JavaScript
 * Handles: Navigation, Menu, Galleries, Scroll Animations
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    Navigation.init();
    MobileMenu.init();
    Gallery.init();
    ScrollAnimations.init();
    SmoothScroll.init();
});

/**
 * Navigation Module
 * Handles sticky header and scroll behavior
 */
const Navigation = {
    header: null,
    lastScrollY: 0,
    scrollThreshold: 100,

    init() {
        this.header = document.querySelector('.header');
        if (!this.header) return;

        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
    },

    handleScroll() {
        const currentScrollY = window.scrollY;

        // Hide header on scroll down, show on scroll up
        if (currentScrollY > this.scrollThreshold) {
            if (currentScrollY > this.lastScrollY) {
                this.header.classList.add('hidden');
            } else {
                this.header.classList.remove('hidden');
            }
        } else {
            this.header.classList.remove('hidden');
        }

        this.lastScrollY = currentScrollY;
    }
};

/**
 * Mobile Menu Module
 * Handles hamburger menu and overlay
 */
const MobileMenu = {
    toggle: null,
    overlay: null,
    menuLinks: null,
    body: document.body,

    init() {
        this.toggle = document.querySelector('.nav-toggle');
        this.overlay = document.querySelector('.menu-overlay');

        if (!this.toggle || !this.overlay) return;

        this.menuLinks = this.overlay.querySelectorAll('.menu-link');
        this.firstLink = this.menuLinks[0];
        this.lastLink = this.menuLinks[this.menuLinks.length - 1];

        this.toggle.addEventListener('click', () => this.toggleMenu());

        // Close menu on link click
        this.menuLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Keyboard handling
        document.addEventListener('keydown', (e) => {
            if (!this.isOpen()) return;

            // Close menu on escape key
            if (e.key === 'Escape') {
                this.closeMenu();
                return;
            }

            // Trap focus within menu
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === this.firstLink) {
                    e.preventDefault();
                    this.lastLink.focus();
                } else if (!e.shiftKey && document.activeElement === this.lastLink) {
                    e.preventDefault();
                    this.firstLink.focus();
                }
            }
        });
    },

    toggleMenu() {
        if (this.isOpen()) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    },

    openMenu() {
        this.toggle.setAttribute('aria-expanded', 'true');
        this.overlay.setAttribute('aria-hidden', 'false');
        this.overlay.classList.add('active');
        this.body.classList.add('menu-open');

        // Focus first menu link after animation
        setTimeout(() => {
            this.firstLink?.focus();
        }, 100);
    },

    closeMenu() {
        this.toggle.setAttribute('aria-expanded', 'false');
        this.overlay.setAttribute('aria-hidden', 'true');
        this.overlay.classList.remove('active');
        this.body.classList.remove('menu-open');

        // Return focus to toggle button
        this.toggle.focus();
    },

    isOpen() {
        return this.overlay.classList.contains('active');
    }
};

/**
 * Gallery Module
 * Handles project image carousels
 */
const Gallery = {
    galleries: [],

    init() {
        const galleryElements = document.querySelectorAll('.project-gallery');

        galleryElements.forEach(gallery => {
            const track = gallery.querySelector('.gallery-track');
            const prevBtn = gallery.querySelector('.gallery-prev');
            const nextBtn = gallery.querySelector('.gallery-next');

            if (!track || !prevBtn || !nextBtn) return;

            const slides = track.querySelectorAll('.gallery-slide');
            const slideWidth = slides[0]?.offsetWidth || 0;
            const gap = 16; // var(--space-4) = 1rem = 16px

            prevBtn.addEventListener('click', () => {
                track.scrollBy({
                    left: -(slideWidth + gap),
                    behavior: 'smooth'
                });
            });

            nextBtn.addEventListener('click', () => {
                track.scrollBy({
                    left: slideWidth + gap,
                    behavior: 'smooth'
                });
            });

            this.galleries.push({ track, slides, slideWidth });
        });
    }
};

/**
 * Scroll Animations Module
 * Handles fade-in animations on scroll using Intersection Observer
 */
const ScrollAnimations = {
    observer: null,

    init() {
        // Add fade-in class to animatable elements
        const animatableElements = document.querySelectorAll(
            '.project-panel, .essay-card, .about-content, .contact-content, .section-title'
        );

        animatableElements.forEach(el => {
            el.classList.add('fade-in');
        });

        // Create intersection observer
        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        // Optionally unobserve after animation
                        // this.observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        // Observe all fade-in elements
        document.querySelectorAll('.fade-in').forEach(el => {
            this.observer.observe(el);
        });
    }
};

/**
 * Smooth Scroll Module
 * Handles smooth scrolling for anchor links
 */
const SmoothScroll = {
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');

                // Skip if it's just "#"
                if (href === '#') return;

                const target = document.querySelector(href);
                if (!target) return;

                e.preventDefault();

                // Account for fixed header
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const targetPosition = target.offsetTop - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            });
        });
    }
};

/**
 * Utility Functions
 */
const Utils = {
    // Debounce function for performance
    debounce(func, wait = 100) {
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

    // Throttle function for scroll events
    throttle(func, limit = 100) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};
