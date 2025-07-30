/*
 * js/testimonial-carousel.js - Testimonial Carousel Controller
 * 
 * Purpose: Handle testimonial carousel navigation and transitions
 * Used by: Testimonials section
 * Dependencies: None
 * Related: 03-sections.css (testimonial styling)
 */

class TestimonialCarousel {
    constructor() {
        // Find testimonial elements
        this.container = document.querySelector('.b-testimonials');
        if (!this.container) {
            console.log('Testimonial container not found');
            return;
        }
        
        // Get carousel elements
        this.slides = this.container.querySelectorAll('.testimonial-slide');
        this.dots = this.container.querySelectorAll('.nav-dots button'); // This gets ALL dots
        this.prevBtns = this.container.querySelectorAll('.nav-arrow--prev');
        this.nextBtns = this.container.querySelectorAll('.nav-arrow--next');
        
        // State
        this.currentSlide = 0;
        this.maxSlide = this.slides.length - 1;
        
        console.log(`Testimonial carousel initialized with ${this.slides.length} slides`);
        this.init();
    }
    
    init() {
        // Bind navigation events
        this.bindEvents();
        
        // Update initial state
        this.updateButtons();
    }
    
    bindEvents() {
        // Previous buttons (both desktop and mobile)
        this.prevBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.goToSlide(this.currentSlide - 1);
            });
        });
        
        // Next buttons (both desktop and mobile)
        this.nextBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.goToSlide(this.currentSlide + 1);
            });
        });
        
        // Dot navigation
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToSlide(index);
            });
        });
        
        // Keyboard navigation
        this.container.addEventListener('keydown', (e) => {
            if (e.target.closest('.testimonial-nav')) {
                switch (e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.goToSlide(this.currentSlide - 1);
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.goToSlide(this.currentSlide + 1);
                        break;
                }
            }
        });
    }
    
    goToSlide(index) {
        // Validate index
        if (index < 0 || index > this.maxSlide) {
            console.log(`Slide ${index} out of bounds (0-${this.maxSlide})`);
            return;
        }
        
        // Remove active class from current slide
        this.slides[this.currentSlide].classList.remove('active');
        
        // Remove active from ALL dots
        this.dots.forEach(dot => dot.classList.remove('active'));
        
        // Update current slide
        this.currentSlide = index;
        
        // Add active class to new slide
        this.slides[this.currentSlide].classList.add('active');
        
        // Add active to corresponding dots (handles both desktop and mobile)
        // Since we have 2 sets of dots (desktop and mobile), update both
        const dotsPerSet = 4;
        for (let i = this.currentSlide; i < this.dots.length; i += dotsPerSet) {
            this.dots[i].classList.add('active');
        }
        
        // Update button states
        this.updateButtons();
        
        console.log(`Showing testimonial ${index + 1} of ${this.slides.length}`);
    }
    
    updateButtons() {
        // Update all prev buttons
        this.prevBtns.forEach(btn => {
            btn.disabled = this.currentSlide === 0;
        });
        
        // Update all next buttons
        this.nextBtns.forEach(btn => {
            btn.disabled = this.currentSlide === this.maxSlide;
        });
    }
}

// Initialize testimonial carousel when DOM is ready
function initTestimonialCarousel() {
    window.testimonialCarousel = new TestimonialCarousel();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTestimonialCarousel);
} else {
    initTestimonialCarousel();
}

// Export for ES6 modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TestimonialCarousel, initTestimonialCarousel };
}