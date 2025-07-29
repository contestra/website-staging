/*
 * js/navigation.js - Header & Navigation
 * 
 * Purpose: Header scroll behavior, mobile menu toggle, and navigation interactions
 * Used by: Site header and navigation elements
 * Dependencies: utilities.js (for helper functions)
 * Related: 02-layout.css (header styling), index.html (header structure)
 * 
 * LLM Working Notes:
 * - Handles sophisticated scroll-aware header behavior (squash/expand)
 * - Direction-aware scrolling with smooth transitions
 * - Mobile menu toggle with proper accessibility
 * - Performance optimized with requestAnimationFrame
 * - Responsive behavior based on screen size
 * 
 * Features:
 * - Header "squashes" when scrolling down, expands when scrolling up
 * - Different scroll thresholds for mobile vs desktop
 * - Mobile hamburger menu with slide-out navigation
 * - Smooth transitions and proper z-index management
 */

/**
 * Navigation Controller Class
 * Manages all header and navigation behavior
 */
class NavigationController {
    constructor() {
        // Core elements
        this.header = document.getElementById('site-header');
        this.mobileMenuBtn = document.getElementById('mobile-menu-btn');
        this.mainMenu = document.getElementById('main-menu');
        
        // Scroll tracking
        this.lastScrollY = window.scrollY;
        this.scrollThreshold = this.getScrollThreshold();
        this.isScrolling = false;
        this.ticking = false;
        
        // Mobile menu state
        this.isMobileMenuOpen = false;
        
        // Initialize if header exists
        if (this.header) {
            this.init();
        } else {
            console.warn('Navigation header not found');
        }
    }
    
    /**
     * Initialize navigation controller
     * Sets up event listeners and initial state
     */
    init() {
        console.log('Navigation controller initializing...');
        
        // Set initial header state
        this.updateHeaderState();
        
        // Bind event listeners
        this.bindScrollEvents();
        this.bindMobileMenuEvents();
        this.bindResizeEvents();
        this.bindAccessibilityEvents();
        
        console.log('Navigation controller initialized');
    }
    
    /**
     * Get appropriate scroll threshold based on screen size
     * @returns {number} Scroll threshold in pixels
     */
    getScrollThreshold() {
        return window.innerWidth <= 768 ? 40 : 60;
    }
    
    /**
     * Bind scroll event listeners with performance optimization
     */
    bindScrollEvents() {
        const handleScroll = () => {
            if (!this.ticking) {
                requestAnimationFrame(() => {
                    this.updateHeaderOnScroll();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        };
        
        // Use passive listener for better performance
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Handle scroll end
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            this.isScrolling = true;
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.isScrolling = false;
            }, 150);
        }, { passive: true });
    }
    
    /**
     * Update header state based on scroll position and direction
     */
    updateHeaderOnScroll() {
        const currentScrollY = window.scrollY;
        const scrollDifference = currentScrollY - this.lastScrollY;
        
        // Only update if scroll difference is significant (reduces jitter)
        if (Math.abs(scrollDifference) > 2) {
            if (currentScrollY > this.scrollThreshold) {
                if (scrollDifference > 0) {
                    // Scrolling DOWN - squash the header
                    this.header.classList.add('scrolled');
                    this.header.classList.remove('scrolling-up');
                } else {
                    // Scrolling UP - expand the header
                    this.header.classList.remove('scrolled');
                    this.header.classList.add('scrolling-up');
                }
            } else {
                // Near the top of the page - always full size
                this.header.classList.remove('scrolled');
                this.header.classList.remove('scrolling-up');
            }
            
            this.lastScrollY = currentScrollY;
        }
    }
    
    /**
     * Set initial header state based on current scroll position
     */
    updateHeaderState() {
        if (window.scrollY > this.scrollThreshold) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled', 'scrolling-up');
        }
    }
    
    /**
     * Bind mobile menu event listeners
     */
    bindMobileMenuEvents() {
        if (!this.mobileMenuBtn || !this.mainMenu) {
            console.log('Mobile menu elements not found - skipping mobile menu setup');
            return;
        }
        
        // Mobile menu button click
        this.mobileMenuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleMobileMenu();
        });
        
        // Close mobile menu when clicking menu links
        this.mainMenu.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                this.closeMobileMenu();
            }
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isMobileMenuOpen && 
                !this.mainMenu.contains(e.target) && 
                !this.mobileMenuBtn.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
        
        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMobileMenuOpen) {
                this.closeMobileMenu();
                this.mobileMenuBtn.focus(); // Return focus to button
            }
        });
    }
    
    /**
     * Toggle mobile menu open/closed state
     */
    toggleMobileMenu() {
        if (this.isMobileMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }
    
    /**
     * Open mobile menu with proper accessibility
     */
    openMobileMenu() {
        this.mainMenu.classList.add('active');
        this.isMobileMenuOpen = true;
        
        // Update button attributes for screen readers
        this.mobileMenuBtn.setAttribute('aria-expanded', 'true');
        this.mobileMenuBtn.setAttribute('aria-label', 'Close menu');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = 'hidden';
        
        // Focus management
        const firstLink = this.mainMenu.querySelector('a');
        if (firstLink) {
            setTimeout(() => firstLink.focus(), 100);
        }
        
        console.log('Mobile menu opened');
    }
    
    /**
     * Close mobile menu
     */
    closeMobileMenu() {
        this.mainMenu.classList.remove('active');
        this.isMobileMenuOpen = false;
        
        // Update button attributes for screen readers
        this.mobileMenuBtn.setAttribute('aria-expanded', 'false');
        this.mobileMenuBtn.setAttribute('aria-label', 'Open menu');
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        console.log('Mobile menu closed');
    }
    
    /**
     * Bind window resize event listeners
     */
    bindResizeEvents() {
        // Use debounced resize handler for performance
        const debouncedResize = this.debounce(() => {
            // Update scroll threshold for new screen size
            this.scrollThreshold = this.getScrollThreshold();
            
            // Close mobile menu if screen becomes desktop size
            if (window.innerWidth > 768 && this.isMobileMenuOpen) {
                this.closeMobileMenu();
            }
            
            // Update header state
            this.updateHeaderState();
            
        }, 250);
        
        window.addEventListener('resize', debouncedResize, { passive: true });
    }
    
    /**
     * Bind accessibility-related event listeners
     */
    bindAccessibilityEvents() {
        // Handle focus within mobile menu
        if (this.mainMenu) {
            this.mainMenu.addEventListener('keydown', (e) => {
                if (!this.isMobileMenuOpen) return;
                
                // Tab navigation within menu
                if (e.key === 'Tab') {
                    const focusableElements = this.mainMenu.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
                    const firstElement = focusableElements[0];
                    const lastElement = focusableElements[focusableElements.length - 1];
                    
                    if (e.shiftKey && document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    } else if (!e.shiftKey && document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            });
        }
        
        // Improve button accessibility
        if (this.mobileMenuBtn) {
            this.mobileMenuBtn.setAttribute('aria-expanded', 'false');
            this.mobileMenuBtn.setAttribute('aria-label', 'Open menu');
            this.mobileMenuBtn.setAttribute('aria-controls', 'main-menu');
        }
    }
    
    /**
     * Debounce utility function (duplicated here for self-contained module)
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
     * Public method to manually update header state
     * Useful for other scripts that might affect layout
     */
    refresh() {
        this.scrollThreshold = this.getScrollThreshold();
        this.updateHeaderState();
        console.log('Navigation refreshed');
    }
    
    /**
     * Cleanup method for removing event listeners
     * Useful for single-page applications
     */
    destroy() {
        // Close mobile menu if open
        if (this.isMobileMenuOpen) {
            this.closeMobileMenu();
        }
        
        // Note: In a full implementation, you'd store references to bound functions
        // and remove event listeners here. For this static site, it's not critical.
        console.log('Navigation controller destroyed');
    }
}

/**
 * Initialize navigation when DOM is ready
 */
function initNavigation() {
    // Initialize navigation controller
    window.navigationController = new NavigationController();
    
    // Make refresh method globally available for other scripts
    window.refreshNavigation = () => {
        if (window.navigationController) {
            window.navigationController.refresh();
        }
    };
}

// Initialize based on document ready state
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigation);
} else {
    initNavigation();
}

// Export for ES6 modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NavigationController, initNavigation };
}