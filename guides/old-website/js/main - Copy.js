/**
 * Contestra Main JavaScript - Production Ready
 * @description Handles animations, form submission, and user interactions
 * @version 1.0.0
 */

// ============================================================
// FEATURE DETECTION
// ============================================================
/**
 * Detects browser capabilities and adds appropriate classes
 * @namespace FeatureDetection
 */
const FeatureDetection = {
    hasBackdropFilter: CSS.supports('backdrop-filter', 'blur(10px)'),
    hasIntersectionObserver: 'IntersectionObserver' in window,
    hasSmoothScroll: 'scrollBehavior' in document.documentElement.style,
    hasWebP: false, // Will be detected asynchronously
    
    /**
     * Initialize feature detection and add classes to html element
     */
    init() {
        const classes = [];
        
        if (this.hasBackdropFilter) {
            classes.push('has-backdrop');
        } else {
            classes.push('no-backdrop');
        }
        
        if (this.hasSmoothScroll) {
            classes.push('has-smooth-scroll');
        }
        
        if (this.hasIntersectionObserver) {
            classes.push('has-io');
        }
        
        document.documentElement.classList.add(...classes);
        
        // Async WebP detection
        this.detectWebP();
    },
    
    /**
     * Detect WebP support asynchronously
     */
    detectWebP() {
        const webP = new Image();
        webP.onload = webP.onerror = () => {
            this.hasWebP = webP.height === 2;
            if (this.hasWebP) {
                document.documentElement.classList.add('has-webp');
            }
        };
        webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    }
};

// ============================================================
// CONFIGURATION
// ============================================================
/**
 * Central configuration object for all settings
 * @constant {Object}
 */
const CONFIG = {
    // Animation Timings (ms)
    animations: {
        heroDelay: 600,
        logoFadeDelay: 650,
        logoCycleInterval: 2800,
        chatStartDelay: 400,
        scrollThreshold: 10
    },
    
    // Chat Settings
    chat: {
        typingSpeed: 30,
        scrollThreshold: 50,
        scrollFrequency: 20,
        preemptiveScrollLine: 4,
        preScrollDelay: 50,
        preTypingDelay: 200,
        pauseMultiplier: 25,
        maxPause: 1200
    },
    
    // Form Settings
    form: {
        webAppUrl: 'https://script.google.com/macros/s/AKfycbwCSu_vvu-A0tlGtdQIr9CXGmqaKccON_Ysw0TKot_PkEXSnIk1hF4JMIOXOxouqHTz/exec',
        personalEmailDomains: [
            'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com',
            'icloud.com', 'mail.com', 'protonmail.com', 'zoho.com', 'yandex.com',
            'gmx.com', 'live.com', 'msn.com', 'googlemail.com'
        ]
    },
    
    // Logo Files
    logos: [
        'images/logos/chatgpt-logo.svg',
        'images/logos/gemini-logo.svg',
        'images/logos/perplexity-logo.svg',
        'images/logos/claude-logo.svg'
    ]
};

// ============================================================
// ERROR HANDLING
// ============================================================
/**
 * Provides error boundary functionality for safer code execution
 * @class
 */
class ErrorBoundary {
    /**
     * Wraps a function with try-catch error handling
     * @param {Function} fn - Function to wrap
     * @param {string} context - Context description for error logging
     * @returns {Function} Wrapped function
     */
    static wrap(fn, context = 'Unknown') {
        return (...args) => {
            try {
                return fn(...args);
            } catch (error) {
                console.error(`Error in ${context}:`, error);
                // Could send to error tracking service here
            }
        };
    }
}

// ============================================================
// ANIMATION MANAGER
// ============================================================
/**
 * Manages animation lifecycle and cleanup
 * @class
 */
class AnimationManager {
    constructor() {
        /** @type {Set<number>} Active interval IDs */
        this.intervals = new Set();
        /** @type {Set<number>} Active timeout IDs */
        this.timeouts = new Set();
    }
    
    /**
     * Create a managed setTimeout
     * @param {Function} fn - Function to execute
     * @param {number} delay - Delay in milliseconds
     * @returns {number} Timeout ID
     */
    setTimeout(fn, delay) {
        const timeout = setTimeout(() => {
            this.timeouts.delete(timeout);
            fn();
        }, delay);
        this.timeouts.add(timeout);
        return timeout;
    }
    
    /**
     * Create a managed setInterval
     * @param {Function} fn - Function to execute
     * @param {number} delay - Interval in milliseconds
     * @returns {number} Interval ID
     */
    setInterval(fn, delay) {
        const interval = setInterval(fn, delay);
        this.intervals.add(interval);
        return interval;
    }
    
    /**
     * Clean up all active timers
     */
    cleanup() {
        this.intervals.forEach(interval => clearInterval(interval));
        this.timeouts.forEach(timeout => clearTimeout(timeout));
        this.intervals.clear();
        this.timeouts.clear();
    }
}

// ============================================================
// MODULES
// ============================================================

/**
 * Handles hero section fade-in animation
 * @namespace HeroAnimation
 */
const HeroAnimation = {
    /**
     * Initialize hero animation
     */
    init() {
        const heroCopy = document.querySelector('.hero-copy');
        const logoCyclerContainer = document.querySelector('.logo-cycler-container');
        
        if (!heroCopy) return;
        
        animationManager.setTimeout(() => {
            heroCopy.classList.add('is-visible');
            if (logoCyclerContainer) {
                logoCyclerContainer.classList.add('is-visible');
            }
        }, CONFIG.animations.heroDelay);
    }
};

/**
 * Manages logo cycling animation
 * @namespace LogoCycler
 */
const LogoCycler = {
    /** @type {number} Current logo index */
    currentIndex: 0,
    /** @type {HTMLImageElement[]} Logo image elements */
    images: [],
    
    /**
     * Initialize logo cycler
     * @async
     */
    async init() {
        const container = document.getElementById('logo-cycler');
        if (!container) return;
        
        const loadedLogos = await this.preloadLogos();
        if (loadedLogos.length === 0) return;
        
        this.createLogoElements(container, loadedLogos);
        this.startCycling();
    },
    
    /**
     * Preload all logo images
     * @async
     * @returns {Promise<string[]>} Array of successfully loaded logo URLs
     */
    async preloadLogos() {
        const loadPromises = CONFIG.logos.map(src => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => resolve(src);
                img.onerror = () => resolve(null);
                img.src = src;
            });
        });
        
        const results = await Promise.all(loadPromises);
        return results.filter(src => src !== null);
    },
    
    /**
     * Create logo DOM elements
     * @param {HTMLElement} container - Container element
     * @param {string[]} logos - Array of logo URLs
     */
    createLogoElements(container, logos) {
        logos.forEach((src, index) => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = src.split('/').pop().replace('-logo.svg', '') + ' logo';
            img.className = 'logo-' + src.split('/').pop().replace('-logo.svg', '');
            if (index === 0) img.classList.add('active');
            container.appendChild(img);
            this.images.push(img);
        });
    },
    
    /**
     * Start the logo cycling animation
     */
    startCycling() {
        animationManager.setTimeout(() => {
            animationManager.setInterval(() => {
                this.images[this.currentIndex].classList.remove('active');
                this.currentIndex = (this.currentIndex + 1) % this.images.length;
                this.images[this.currentIndex].classList.add('active');
            }, CONFIG.animations.logoCycleInterval);
        }, CONFIG.animations.logoFadeDelay + CONFIG.animations.heroDelay);
    }
};

/**
 * Manages chat animation sequence
 * @namespace ChatAnimation
 */
const ChatAnimation = {
    /**
     * Initialize chat animation
     * @async
     */
    async init() {
        const morphBall = document.querySelector('.morph-ball');
        if (!morphBall) return;
        
        morphBall.addEventListener('animationend', (event) => {
            if (event.animationName === 'pulse') {
                this.startChat();
                morphBall.style.display = 'none';
            }
        });
    },
    
    /**
     * Start the chat animation sequence
     * @async
     */
    async startChat() {
        const chatLines = document.querySelectorAll('.chat-line');
        const chatBody = document.querySelector('.chat-body');
        if (!chatLines.length || !chatBody) return;
        
        const texts = this.prepareChat(chatLines);
        await this.animateChat(chatLines, chatBody, texts);
    },
    
    /**
     * Prepare chat lines for animation
     * @param {NodeListOf<Element>} chatLines - Chat line elements
     * @returns {string[]} Array of text content
     */
    prepareChat(chatLines) {
        const texts = [];
        chatLines.forEach((line, idx) => {
            line.style.display = 'none';
            line.classList.add(idx % 2 === 0 ? 'from-user' : 'from-ai');
            const p = line.querySelector('p');
            if (p) {
                texts.push(p.textContent);
                p.textContent = '';
            }
        });
        return texts;
    },
    
    /**
     * Animate chat lines with typewriter effect
     * @async
     * @param {NodeListOf<Element>} chatLines - Chat line elements
     * @param {HTMLElement} chatBody - Chat body container
     * @param {string[]} texts - Text content array
     */
    async animateChat(chatLines, chatBody, texts) {
        const scrollIfNeeded = () => {
            if (chatBody.scrollHeight > chatBody.clientHeight) {
                chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: 'smooth' });
            }
        };
        
        await new Promise(r => animationManager.setTimeout(r, CONFIG.chat.chatStartDelay));
        
        for (let i = 0; i < chatLines.length; i++) {
            const line = chatLines[i];
            const p = line.querySelector('p');
            
            if (i >= CONFIG.chat.preemptiveScrollLine) {
                scrollIfNeeded();
                await new Promise(r => animationManager.setTimeout(r, CONFIG.chat.preScrollDelay));
            }
            
            line.style.display = 'flex';
            line.classList.add('visible');
            scrollIfNeeded();
            
            await new Promise(r => animationManager.setTimeout(r, CONFIG.chat.preTypingDelay));
            
            if (p && texts[i]) {
                await this.typewrite(
                    p, 
                    texts[i], 
                    CONFIG.chat.typingSpeed,
                    texts[i].length > CONFIG.chat.scrollThreshold ? scrollIfNeeded : null
                );
            }
            
            scrollIfNeeded();
            
            const pause = Math.min(CONFIG.chat.maxPause, texts[i].length * CONFIG.chat.pauseMultiplier);
            await new Promise(r => animationManager.setTimeout(r, pause));
        }
    },
    
    /**
     * Typewriter effect for text
     * @param {HTMLElement} element - Target element
     * @param {string} text - Text to type
     * @param {number} speed - Typing speed in ms
     * @param {Function|null} scrollCallback - Optional scroll callback
     * @returns {Promise} Promise that resolves when typing is complete
     */
    typewrite(element, text, speed = 30, scrollCallback = null) {
        return new Promise(resolve => {
            element.innerHTML = '';
            element.classList.add('typing-effect');
            let i = 0;
            
            const typeNextChar = () => {
                if (i < text.length) {
                    const span = document.createElement('span');
                    span.className = 'char';
                    span.textContent = text[i];
                    element.appendChild(span);
                    i++;
                    
                    if (scrollCallback && i % CONFIG.chat.scrollFrequency === 0) {
                        scrollCallback();
                    }
                    
                    animationManager.setTimeout(typeNextChar, speed);
                } else {
                    element.classList.remove('typing-effect');
                    if (scrollCallback) scrollCallback();
                    resolve();
                }
            };
            
            typeNextChar();
        });
    }
};

/**
 * Handles form validation and submission
 * @namespace FormHandler
 */
const FormHandler = {
    /**
     * Initialize form handlers
     */
    init() {
        const form = document.querySelector('.demo-form');
        const emailInput = document.querySelector('.email-input');
        const navButton = document.querySelector('.email-btn');
        
        if (form) {
            form.addEventListener('submit', ErrorBoundary.wrap(
                (e) => this.handleSubmit(e),
                'Form Submit'
            ));
        }
        
        if (emailInput) {
            emailInput.addEventListener('input', ErrorBoundary.wrap(
                () => this.validateEmail(),
                'Email Validation'
            ));
        }
        
        if (navButton && emailInput) {
            // Updated handler for smooth scroll
            navButton.addEventListener('click', ErrorBoundary.wrap(
                (e) => {
                    e.preventDefault();
                    const target = document.querySelector('#demo-form');
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        // Maintain focus functionality
                        animationManager.setTimeout(() => {
                            emailInput.focus();
                            emailInput.classList.add('input-success', 'pulse-attention');
                            emailInput.classList.remove('input-error');
                            
                            animationManager.setTimeout(() => {
                                emailInput.classList.remove('pulse-attention');
                            }, 800);
                        }, 500);
                    }
                },
                'Nav Button Click'
            ));
        }
    },
    
    /**
     * Validate email input
     * @returns {boolean} Validation result
     */
    validateEmail() {
        const emailInput = document.querySelector('.email-input');
        const errorMessage = document.getElementById('email-error-message');
        const email = emailInput.value.trim();
        const emailDomain = email.substring(email.lastIndexOf('@') + 1);
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        
        emailInput.classList.remove('input-error', 'input-success');
        
        if (email === '') {
            emailInput.classList.add('input-error');
            errorMessage.textContent = 'Please complete this required field.';
            return false;
        }
        
        if (!emailRegex.test(email)) {
            emailInput.classList.add('input-error');
            errorMessage.textContent = 'Please enter a valid email format.';
            return false;
        }
        
        if (CONFIG.form.personalEmailDomains.includes(emailDomain)) {
            emailInput.classList.add('input-error');
            errorMessage.textContent = 'Please use a business email address.';
            return false;
        }
        
        emailInput.classList.add('input-success');
        errorMessage.textContent = '';
        return true;
    },
    
    /**
     * Handle form submission
     * @async
     * @param {Event} e - Submit event
     */
    async handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateEmail()) return;
        
        const emailInput = document.querySelector('.email-input');
        const submitButton = e.target.querySelector('.demo-btn');
        const originalText = submitButton.textContent;
        
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';
        
        try {
            await fetch(CONFIG.form.webAppUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailInput.value })
            });
            
            this.showSuccessState(emailInput.value);
        } catch (error) {
            console.error('Submission error:', error);
            alert('There was a problem with your submission. Please try again.');
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    },
    
    /**
     * Show success state after form submission
     * @param {string} email - Submitted email address
     */
    showSuccessState(email) {
        const form = document.querySelector('.demo-form');
        const errorMessage = document.getElementById('email-error-message');
        const thankYouMessage = document.getElementById('thank-you-message');
        const emailDisplay = document.getElementById('submitted-email');
        const navButton = document.querySelector('.email-btn');
        
        form.style.display = 'none';
        errorMessage.style.display = 'none';
        emailDisplay.textContent = email;
        thankYouMessage.style.display = 'flex';
        thankYouMessage.classList.add('success');
        
        if (navButton) {
            navButton.textContent = 'Thank you';
            navButton.style.backgroundColor = '#2E8B67';
            navButton.style.pointerEvents = 'none';
        }
    }
};

/**
 * Manages header scroll effects
 * @namespace HeaderScroll
 */
const HeaderScroll = {
    /**
     * Initialize header scroll listener
     */
    init() {
        const header = document.querySelector('header');
        if (!header) return;
        
        let ticking = false;
        
        const updateHeader = () => {
            if (window.scrollY > CONFIG.animations.scrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateHeader);
                ticking = true;
            }
        });
    }
};

/**
 * Handles scroll-triggered animations
 * @namespace ScrollAnimation
 */
const ScrollAnimation = {
    init() {
        const target = document.querySelector('.features-section');
        if (!target || !window.IntersectionObserver) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // Animate only once
                }
            });
        }, { threshold: 0.1 }); // Trigger when 10% of the element is visible

        observer.observe(target);
    }
};

// ============================================================
// INITIALIZATION
// ============================================================
/** @type {AnimationManager} Global animation manager instance */
const animationManager = new AnimationManager();

/**
 * Initialize all modules when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize feature detection
    FeatureDetection.init();
    
    // Initialize all modules
    HeroAnimation.init();
    LogoCycler.init();
    ChatAnimation.init();
    FormHandler.init();
    HeaderScroll.init();
    ScrollAnimation.init(); // Add this line
});

/**
 * Cleanup animations before page unload
 */
window.addEventListener('beforeunload', () => {
    animationManager.cleanup();
});