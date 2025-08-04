/*
 * js/utilities.js - Helper Functions
 * 
 * Purpose: General utility functions used across the site
 * Used by: Other JavaScript files and global functionality
 * Dependencies: None (foundation file)
 * Related: All other JS files may use these utilities
 * 
 * LLM Working Notes:
 * - Contains reusable helper functions to avoid code duplication
 * - Marquee fix functionality for seamless logo scrolling
 * - Smooth scroll utility for anchor links
 * - Throttling and debouncing utilities for performance
 * - Modern JavaScript (ES6+) with proper error handling
 * 
 * Functions:
 * - fixMarquee(): Calculates precise marquee animation timing
 * - smoothScrollTo(): Smooth scrolling utility for navigation
 * - throttle(): Performance optimization for scroll events
 * - debounce(): Performance optimization for resize events
 */

/**
 * Fix marquee gap with precise measurement
 * Calculates exact width of logo set for seamless animation loop
 * Called on: page load, window resize
 */
function fixMarquee() {
    // DISABLED: Using pure CSS animation for better performance
    // The JavaScript calculation was causing gaps and stutter
    // CSS handles the 50% transform seamlessly
    
    const track = document.querySelector('.marquee__track');
    if (track) {
        // Remove any existing inline styles
        track.style.animation = '';
        
        // Remove any dynamically created keyframes
        const existingStyle = document.getElementById('marquee-keyframes');
        if (existingStyle) existingStyle.remove();
    }
    
    return; // Exit early - let CSS handle the animation
}

/**
 * Smooth scroll to target element
 * @param {Element} target - Element to scroll to
 * @param {number} offset - Offset from top (default: header height + 20px)
 */
function smoothScrollTo(target, offset = null) {
    if (!target) {
        console.warn('Smooth scroll target not found');
        return;
    }
    
    try {
        // Calculate offset (header height + buffer)
        const header = document.getElementById('site-header');
        const defaultOffset = header ? header.offsetHeight + 20 : 80;
        const scrollOffset = offset !== null ? offset : defaultOffset;
        
        // Calculate target position
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - scrollOffset;
        
        // Smooth scroll with fallback for older browsers
        if (window.scrollTo && typeof window.scrollTo === 'function') {
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        } else {
            // Fallback for browsers without smooth scrolling support
            window.scrollTo(0, targetPosition);
        }
        
    } catch (error) {
        console.error('Error during smooth scroll:', error);
        // Fallback to simple scroll
        window.scrollTo(0, target.offsetTop - 80);
    }
}

/**
 * Throttle function - limits how often a function can be called
 * Used for scroll events to improve performance
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
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

/**
 * Debounce function - delays function execution until after delay period
 * Used for resize events to improve performance
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

/**
 * Check if user prefers reduced motion
 * @returns {boolean} True if user prefers reduced motion
 */
function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get responsive breakpoint info
 * @returns {object} Object with current breakpoint information
 */
function getBreakpoint() {
    const width = window.innerWidth;
    return {
        isMobile: width <= 768,
        isTablet: width > 768 && width <= 1024,
        isDesktop: width > 1024,
        width: width
    };
}

/**
 * Safely query selector with error handling
 * @param {string} selector - CSS selector
 * @param {Element} context - Context element (default: document)
 * @returns {Element|null} Found element or null
 */
function safeQuerySelector(selector, context = document) {
    try {
        return context.querySelector(selector);
    } catch (error) {
        console.error(`Error with selector "${selector}":`, error);
        return null;
    }
}

/**
 * Safely query all selectors with error handling
 * @param {string} selector - CSS selector
 * @param {Element} context - Context element (default: document)
 * @returns {NodeList} Found elements (empty if error)
 */
function safeQuerySelectorAll(selector, context = document) {
    try {
        return context.querySelectorAll(selector);
    } catch (error) {
        console.error(`Error with selector "${selector}":`, error);
        return [];
    }
}

/**
 * Add event listener with error handling
 * @param {Element} element - Element to add listener to
 * @param {string} event - Event type
 * @param {Function} handler - Event handler
 * @param {object} options - Event listener options
 */
function safeEventListener(element, event, handler, options = {}) {
    if (!element || typeof handler !== 'function') {
        console.error('Invalid element or handler for event listener');
        return;
    }
    
    try {
        element.addEventListener(event, handler, options);
    } catch (error) {
        console.error(`Error adding ${event} listener:`, error);
    }
}

/**
 * Initialize utilities on DOM load
 * Sets up initial marquee fix and resize handlers
 */
function initUtilities() {
    // Fix marquee after images load for accurate measurements - only if marquee exists
    const checkAndFixMarquee = () => {
        const marqueeTrack = document.querySelector('.marquee__track');
        if (marqueeTrack) {
            setTimeout(fixMarquee, 100);
        }
    };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.addEventListener('load', checkAndFixMarquee);
        });
    } else {
        window.addEventListener('load', checkAndFixMarquee);
    }
    
    // Re-fix marquee on resize (debounced for performance) - only if marquee exists
    const debouncedMarqueeFix = debounce(() => {
        const marqueeTrack = document.querySelector('.marquee__track');
        if (marqueeTrack) {
            fixMarquee();
        }
    }, 250);
    safeEventListener(window, 'resize', debouncedMarqueeFix, { passive: true });
    
    // Set up smooth scroll for all anchor links
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (link && link.getAttribute('href') !== '#') {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                smoothScrollTo(target);
            }
        }
    });
    
    console.log('Utilities initialized');
}

// Initialize utilities
initUtilities();

// Export functions for use by other modules (if using ES6 modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fixMarquee,
        smoothScrollTo,
        throttle,
        debounce,
        prefersReducedMotion,
        getBreakpoint,
        safeQuerySelector,
        safeQuerySelectorAll,
        safeEventListener
    };
}