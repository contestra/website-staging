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
        this.dots = this.container.querySelectorAll('.nav-dots button');
        this.prevBtn = this.container.querySelector('.nav-arrow--prev');
        this.nextBtn = this.container.querySelector('.nav-arrow--next');
        
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
        // Previous button
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.goToSlide(this.currentSlide - 1);
            });
        }
        
        // Next button
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.goToSlide(this.currentSlide + 1);
            });
        }
        
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
        this.dots[this.currentSlide].classList.remove('active');
        
        // Update current slide
        this.currentSlide = index;
        
        // Add active class to new slide
        this.slides[this.currentSlide].classList.add('active');
        this.dots[this.currentSlide].classList.add('active');
        
        // Update button states
        this.updateButtons();
        
        console.log(`Showing testimonial ${index + 1} of ${this.slides.length}`);
    }
    
    updateButtons() {
        // Update prev button
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentSlide === 0;
        }
        
        // Update next button
        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentSlide === this.maxSlide;
        }
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