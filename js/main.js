// ========================================
// EMBER & SAGE - Main JavaScript
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    Navigation.init();
    Carousel.init();
    MenuFilter.init();
    ScrollAnimations.init();
    FormHandling.init();
});

// ========================================
// Navigation Module
// ========================================
const Navigation = {
    nav: null,
    toggle: null,
    menu: null,
    links: null,
    
    init() {
        this.nav = document.querySelector('.nav');
        this.toggle = document.querySelector('.nav__toggle');
        this.menu = document.querySelector('.nav__menu');
        this.links = document.querySelectorAll('.nav__link');
        
        if (!this.nav) return;
        
        this.bindEvents();
        this.setActiveLink();
    },
    
    bindEvents() {
        // Scroll effect
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Mobile toggle
        if (this.toggle) {
            this.toggle.addEventListener('click', () => this.toggleMenu());
        }
        
        // Close menu on link click
        this.links.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
        
        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (this.menu && this.menu.classList.contains('active')) {
                if (!this.menu.contains(e.target) && !this.toggle.contains(e.target)) {
                    this.closeMenu();
                }
            }
        });
    },
    
    handleScroll() {
        if (window.scrollY > 50) {
            this.nav.classList.add('scrolled');
        } else {
            this.nav.classList.remove('scrolled');
        }
    },
    
    toggleMenu() {
        this.menu.classList.toggle('active');
        this.toggle.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    },
    
    closeMenu() {
        this.menu.classList.remove('active');
        this.toggle.classList.remove('active');
        document.body.classList.remove('menu-open');
    },
    
    setActiveLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        this.links.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    }
};

// ========================================
// Carousel Module
// ========================================
const Carousel = {
    track: null,
    slides: null,
    dots: null,
    prevBtn: null,
    nextBtn: null,
    currentIndex: 0,
    autoplayInterval: null,
    autoplayDelay: 5000,
    
    init() {
        this.track = document.querySelector('.carousel__track');
        this.slides = document.querySelectorAll('.carousel__slide');
        this.dots = document.querySelectorAll('.carousel__dot');
        this.prevBtn = document.querySelector('.carousel__nav--prev');
        this.nextBtn = document.querySelector('.carousel__nav--next');
        
        if (!this.track || this.slides.length === 0) return;
        
        this.bindEvents();
        this.startAutoplay();
    },
    
    bindEvents() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prev());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.next());
        }
        
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goTo(index));
        });
        
        // Pause autoplay on hover
        const carousel = document.querySelector('.carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => this.stopAutoplay());
            carousel.addEventListener('mouseleave', () => this.startAutoplay());
        }
        
        // Touch support
        let startX = 0;
        let isDragging = false;
        
        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        });
        
        this.track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const currentX = e.touches[0].clientX;
            const diff = startX - currentX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.next();
                } else {
                    this.prev();
                }
                isDragging = false;
            }
        });
        
        this.track.addEventListener('touchend', () => {
            isDragging = false;
        });
    },
    
    goTo(index) {
        this.currentIndex = index;
        this.update();
    },
    
    next() {
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
        this.update();
    },
    
    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.update();
    },
    
    update() {
        // Move track
        this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
        
        // Update dots
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    },
    
    startAutoplay() {
        this.stopAutoplay();
        this.autoplayInterval = setInterval(() => this.next(), this.autoplayDelay);
    },
    
    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
};

// ========================================
// Menu Filter Module
// ========================================
const MenuFilter = {
    buttons: null,
    items: null,
    
    init() {
        this.buttons = document.querySelectorAll('.menu-category-btn');
        this.items = document.querySelectorAll('.menu-item');
        
        if (this.buttons.length === 0 || this.items.length === 0) return;
        
        this.bindEvents();
    },
    
    bindEvents() {
        this.buttons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.dataset.category;
                this.filter(category);
                this.setActiveButton(button);
            });
        });
    },
    
    filter(category) {
        this.items.forEach(item => {
            const itemCategory = item.dataset.category;
            
            if (category === 'all' || itemCategory === category) {
                item.style.display = 'grid';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 50);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    },
    
    setActiveButton(activeButton) {
        this.buttons.forEach(button => {
            button.classList.remove('active');
        });
        activeButton.classList.add('active');
    }
};

// ========================================
// Scroll Animations Module
// ========================================
const ScrollAnimations = {
    elements: null,
    
    init() {
        this.elements = document.querySelectorAll('.fade-in');
        
        if (this.elements.length === 0) return;
        
        this.createObserver();
    },
    
    createObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, options);
        
        this.elements.forEach(element => {
            observer.observe(element);
        });
    }
};

// ========================================
// Form Handling Module
// ========================================
const FormHandling = {
    init() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        });
    },
    
    handleSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Simple validation
        if (!this.validateForm(form)) {
            return;
        }
        
        // Show success message (in real app, this would send to server)
        this.showSuccess(form);
    },
    
    validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
                this.showError(field, 'This field is required');
            } else {
                field.classList.remove('error');
                this.clearError(field);
            }
            
            // Email validation
            if (field.type === 'email' && field.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(field.value)) {
                    isValid = false;
                    field.classList.add('error');
                    this.showError(field, 'Please enter a valid email');
                }
            }
            
            // Phone validation
            if (field.type === 'tel' && field.value) {
                const phoneRegex = /^[\d\s\-\+\(\)]+$/;
                if (!phoneRegex.test(field.value)) {
                    isValid = false;
                    field.classList.add('error');
                    this.showError(field, 'Please enter a valid phone number');
                }
            }
        });
        
        return isValid;
    },
    
    showError(field, message) {
        const errorSpan = field.parentElement.querySelector('.error-message');
        if (!errorSpan) {
            const span = document.createElement('span');
            span.className = 'error-message';
            span.textContent = message;
            span.style.color = '#C4704B';
            span.style.fontSize = '0.75rem';
            span.style.marginTop = '0.25rem';
            span.style.display = 'block';
            field.parentElement.appendChild(span);
        }
    },
    
    clearError(field) {
        const errorSpan = field.parentElement.querySelector('.error-message');
        if (errorSpan) {
            errorSpan.remove();
        }
    },
    
    showSuccess(form) {
        const submitBtn = form.querySelector('[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sent!';
        submitBtn.style.backgroundColor = '#8B9E8B';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.backgroundColor = '';
            submitBtn.disabled = false;
            form.reset();
        }, 3000);
    }
};

// ========================================
// Utility Functions
// ========================================
function debounce(func, wait = 20) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
