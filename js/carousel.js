/*
 * js/carousel.js - Carousel & Card Interactions
 * 
 * Purpose: Scale AI section carousel navigation and card flip functionality
 * Used by: Scale AI section (.scale-ai-carousel)
 * Dependencies: utilities.js (for helper functions)
 * Related: 04-components.css (carousel styling), 03-sections.css (section layout)
 * 
 * LLM Working Notes:
 * - Desktop: 2-card carousel view with 3D card flip animations
 * - Mobile: Vertical stack with simple show/hide flip (no 3D transforms)
 * - Touch support for swipe navigation on mobile
 * - Keyboard accessibility (arrow keys, Enter/Space for flip)
 * - Gradient bar logic: visible on mobile front face, hidden on desktop
 * 
 * Features:
 * - Carousel: Shows 2 of 3 cards with arrow/dot navigation
 * - Card Flip: 3D Y-axis rotation on desktop, simple toggle on mobile
 * - Touch Support: Swipe gestures for carousel navigation
 * - Accessibility: Keyboard navigation and screen reader support
 */

/**
 * Scale AI Carousel Controller
 * Manages carousel navigation and card flip functionality
 */
class ScaleAICarousel {
    constructor() {
        // Find carousel container
        this.carousel = document.querySelector('.scale-ai-carousel');
        if (!this.carousel) {
            console.log('Scale AI carousel not found');
            return;
        }
        
        // Core carousel elements
        this.cards = this.carousel.querySelector('.scale-ai-cards');
        this.prevBtn = this.carousel.querySelector('.carousel-arrow--prev');
        this.nextBtn = this.carousel.querySelector('.carousel-arrow--next');
        this.dots = this.carousel.querySelectorAll('.carousel-dot');
        
        // Carousel state
        this.currentSlide = 0;
        this.maxSlide = 1; // 0 or 1 for 2 positions with 3 cards
        this.isDesktop = window.innerWidth > 768;
        
        // Touch handling
        this.touchStartX = 0;
        this.touchCurrentX = 0;
        this.isDragging = false;
        
        console.log('Scale AI carousel found, initializing...');
        this.init();
    }
    
    /**
     * Initialize carousel functionality
     */
    init() {
        // Set initial slide position
        this.cards.setAttribute('data-slide', '0');
        
        // Bind carousel navigation events
        this.bindCarouselEvents();
        
        // Initialize card flip functionality
        this.initCardFlips();
        
        // Add touch support
        this.addTouchSupport();
        
        // Handle responsive behavior
        this.bindResponsiveEvents();
        
        console.log('Scale AI carousel initialized');
    }
    
    /**
     * Bind carousel navigation events
     */
    bindCarouselEvents() {
        // Arrow button navigation
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.goToSlide(this.currentSlide - 1);
            });
        }
        
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
        
        // Keyboard navigation for carousel
        this.carousel.addEventListener('keydown', (e) => {
            if (e.target.closest('.carousel-controls')) {
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
    
    /**
     * Navigate to specific slide
     * @param {number} slideIndex - Target slide index
     */
    goToSlide(slideIndex) {
        // Validate slide index
        if (slideIndex < 0 || slideIndex > this.maxSlide) {
            console.log(`Slide ${slideIndex} out of bounds (0-${this.maxSlide})`);
            return;
        }
        
        console.log(`Navigating to slide ${slideIndex}`);
        
        this.currentSlide = slideIndex;
        
        // Update cards position
        this.cards.setAttribute('data-slide', slideIndex.toString());
        
        // Update dot indicators
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === slideIndex);
        });
        
        // Update arrow button states
        if (this.prevBtn) {
            this.prevBtn.disabled = slideIndex === 0;
        }
        if (this.nextBtn) {
            this.nextBtn.disabled = slideIndex === this.maxSlide;
        }
        
        // Announce slide change for screen readers
        this.announceSlideChange(slideIndex);
    }
    
    /**
     * Announce slide change for accessibility
     * @param {number} slideIndex - Current slide index
     */
    announceSlideChange(slideIndex) {
        const announcement = `Showing cards ${slideIndex === 0 ? '1 and 2' : '2 and 3'} of 3`;
        
        // Create or update screen reader announcement
        let announcer = document.getElementById('carousel-announcer');
        if (!announcer) {
            announcer = document.createElement('div');
            announcer.id = 'carousel-announcer';
            announcer.setAttribute('aria-live', 'polite');
            announcer.setAttribute('aria-atomic', 'true');
            announcer.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
            document.body.appendChild(announcer);
        }
        
        announcer.textContent = announcement;
    }
    
    /**
     * Initialize card flip functionality
     * Desktop: 3D flip animations, Mobile: Simple show/hide
     */
    initCardFlips() {
        const cards = this.carousel.querySelectorAll('.b-link');
        const isMobile = window.innerWidth <= 768;
        
        cards.forEach((card, index) => {
            // Remove any existing listeners to prevent duplicates
            const newCard = card.cloneNode(true);
            card.parentNode.replaceChild(newCard, card);
            
            // Initialize gradient visibility on mobile
            if (isMobile && !newCard.classList.contains('flipped')) {
                newCard.classList.add('show-gradient');
            }
            
            // Handle clicks on the entire card
            newCard.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent default link behavior
                this.toggleCardFlip(newCard, index);
            });
            
            // Handle keyboard navigation for card flips
            newCard.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleCardFlip(newCard, index);
                }
            });
            
            // Add proper accessibility attributes
            newCard.setAttribute('role', 'button');
            newCard.setAttribute('tabindex', '0');
            newCard.setAttribute('aria-pressed', 'false');
            newCard.setAttribute('aria-label', `Card ${index + 1}: Click to flip and see more details`);
        });
        
        console.log(`Card flip functionality initialized for ${cards.length} cards`);
    }
    
    /**
     * Toggle card flip state
     * @param {Element} card - Card element to flip
     * @param {number} index - Card index for accessibility
     */
    toggleCardFlip(card, index) {
        const isFlipped = card.classList.contains('flipped');
        const isMobile = window.innerWidth <= 768;
        
        if (isFlipped) {
            // Flip back to front
            card.classList.remove('flipped');
            card.setAttribute('aria-pressed', 'false');
            card.setAttribute('aria-label', `Card ${index + 1}: Click to flip and see more details`);
            
            // Explicitly show gradient bar on mobile when flipping back
            if (isMobile) {
                card.classList.add('show-gradient');
                // Force a reflow to ensure the class is applied
                card.offsetHeight;
            }
            
            console.log(`Card ${index + 1} flipped to front`);
        } else {
            // Flip to back
            card.classList.add('flipped');
            card.setAttribute('aria-pressed', 'true');
            card.setAttribute('aria-label', `Card ${index + 1}: Click to flip back to summary`);
            
            // Explicitly hide gradient bar on mobile when flipping
            if (isMobile) {
                card.classList.remove('show-gradient');
            }
            
            console.log(`Card ${index + 1} flipped to back`);
        }
        
        // Announce flip for screen readers
        const announcement = isFlipped ? 
            `Card ${index + 1} showing summary` : 
            `Card ${index + 1} showing details`;
        this.announceCardFlip(announcement);
    }
    
    /**
     * Announce card flip for accessibility
     * @param {string} message - Message to announce
     */
    announceCardFlip(message) {
        let announcer = document.getElementById('card-flip-announcer');
        if (!announcer) {
            announcer = document.createElement('div');
            announcer.id = 'card-flip-announcer';
            announcer.setAttribute('aria-live', 'polite');
            announcer.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
            document.body.appendChild(announcer);
        }
        
        announcer.textContent = message;
    }
    
    /**
     * Add touch support for mobile carousel navigation
     */
    addTouchSupport() {
        const handleTouchStart = (e) => {
            if (!this.isDesktop) return; // Only on desktop carousel
            
            this.isDragging = true;
            this.touchStartX = e.touches[0].clientX;
            this.cards.style.transition = 'none';
        };
        
        const handleTouchMove = (e) => {
            if (!this.isDragging || !this.isDesktop) return;
            
            e.preventDefault();
            this.touchCurrentX = e.touches[0].clientX;
            const diff = this.touchCurrentX - this.touchStartX;
            const currentTransform = this.currentSlide * -50;
            const newTransform = currentTransform + (diff / this.carousel.offsetWidth * 50);
            
            // Apply transform with smooth movement
            this.cards.style.transform = `translateX(${newTransform}%)`;
        };
        
        const handleTouchEnd = () => {
            if (!this.isDragging || !this.isDesktop) return;
            
            this.isDragging = false;
            this.cards.style.transition = '';
            
            const diff = this.touchCurrentX - this.touchStartX;
            const threshold = this.carousel.offsetWidth * 0.2; // 20% of carousel width
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0 && this.currentSlide > 0) {
                    // Swipe right - go to previous slide
                    this.goToSlide(this.currentSlide - 1);
                } else if (diff < 0 && this.currentSlide < this.maxSlide) {
                    // Swipe left - go to next slide
                    this.goToSlide(this.currentSlide + 1);
                } else {
                    // Not enough movement or at boundary - snap back
                    this.goToSlide(this.currentSlide);
                }
            } else {
                // Not enough movement - snap back to current slide
                this.goToSlide(this.currentSlide);
            }
        };
        
        // Add touch event listeners
        this.carousel.addEventListener('touchstart', handleTouchStart, { passive: true });
        this.carousel.addEventListener('touchmove', handleTouchMove, { passive: false });
        this.carousel.addEventListener('touchend', handleTouchEnd, { passive: true });
        
        console.log('Touch support added to carousel');
    }
    
    /**
     * Handle responsive behavior changes
     */
    bindResponsiveEvents() {
        const handleResize = this.debounce(() => {
            const wasDesktop = this.isDesktop;
            this.isDesktop = window.innerWidth > 768;
            
            // If switching from desktop to mobile
            if (wasDesktop && !this.isDesktop) {
                console.log('Switching to mobile view');
                this.resetToMobile();
            }
            // If switching from mobile to desktop
            else if (!wasDesktop && this.isDesktop) {
                console.log('Switching to desktop view');
                this.resetToDesktop();
            }
            // Even if staying on same view, reinitialize to fix any issues
            else if (this.isDesktop) {
                console.log('Refreshing desktop view after resize');
                // Remove and re-add flip functionality to ensure it works
                this.initCardFlips();
            }
        }, 250);
        
        window.addEventListener('resize', handleResize, { passive: true });
    }
    
    /**
     * Reset carousel for mobile view
     */
    resetToMobile() {
        // Remove all flip states
        const cards = this.carousel.querySelectorAll('.b-link');
        cards.forEach((card) => {
            card.classList.remove('flipped');
            card.removeAttribute('role');
            card.removeAttribute('tabindex');
            card.removeAttribute('aria-pressed');
            card.removeAttribute('aria-label');
        });
        
        console.log('Carousel reset for mobile view');
    }
    
    /**
     * Reset carousel for desktop view
     */
    resetToDesktop() {
        // Reset all cards to unflipped state first
        const cards = this.carousel.querySelectorAll('.b-link');
        cards.forEach((card) => {
            card.classList.remove('flipped');
            card.setAttribute('aria-pressed', 'false');
        });
        
        // Re-initialize card flips to ensure event listeners are properly attached
        this.initCardFlips();
        
        // Reset carousel to first slide
        this.goToSlide(0);
        
        console.log('Carousel reset for desktop view');
    }
    
    /**
     * Debounce utility for resize events
     * @param {Function} func - Function to debounce
     * @param {number} delay - Delay in milliseconds
     * @returns {Function} Debounced function
     */
    debounce(func, delay) {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }
    
    /**
     * Public method to refresh carousel state
     */
    refresh() {
        this.isDesktop = window.innerWidth > 768;
        this.goToSlide(0); // Reset to first slide
        
        if (this.isDesktop) {
            this.initCardFlips();
        } else {
            this.resetToMobile();
        }
        
        console.log('Carousel refreshed');
    }
    
    /**
     * Destroy carousel and clean up event listeners
     */
    destroy() {
        // Reset all card states
        const cards = this.carousel.querySelectorAll('.b-link');
        cards.forEach((card) => {
            card.classList.remove('flipped');
            card.removeAttribute('role');
            card.removeAttribute('tabindex');
            card.removeAttribute('aria-pressed');
            card.removeAttribute('aria-label');
        });
        
        // Remove announcer elements
        const announcer = document.getElementById('carousel-announcer');
        if (announcer) announcer.remove();
        
        const flipAnnouncer = document.getElementById('card-flip-announcer');
        if (flipAnnouncer) flipAnnouncer.remove();
        
        console.log('Carousel destroyed');
    }
}

/**
 * Initialize Scale AI Carousel
 */
function initScaleAICarousel() {
    // Create carousel instance
    window.scaleAICarousel = new ScaleAICarousel();
    
    // Make refresh method globally available
    window.refreshCarousel = () => {
        if (window.scaleAICarousel) {
            window.scaleAICarousel.refresh();
        }
    };
}

/**
 * Initialize carousel when DOM is ready
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScaleAICarousel);
} else {
    initScaleAICarousel();
}

// Export for ES6 modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ScaleAICarousel, initScaleAICarousel };
}