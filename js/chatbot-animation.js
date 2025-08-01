/*
 * js/enhanced2 chatbot-animation.js - Enhanced Chatbot Typing Animation with Message Pop Effects
 * 
 * Purpose: Animated typing effect for chatbot messages in hero section with enhanced features
 * Used by: Hero section chatbot container (#chatMessages)
 * Dependencies: None (self-contained animation system)
 * Related: 05-animations.css (chatbot styling), 03-sections.css (hero section)
 * 
 * LLM Working Notes:
 * - Enhanced with 3-dot typing indicator for AI messages
 * - LENGTH-BASED COMPLEXITY: Longer messages get longer "thinking" time
 * - NATURAL VARIATION: Random timing variation for human-like feel
 * - ENHANCED2: Coordinated message pop animations
 * - ENHANCED2: Smooth elastic easing timing
 * - ENHANCED2: Better animation synchronization
 * - Improved animation timing with spring and smooth easings
 * - Natural typing variations and pauses
 * - Continuous loop with proper reset and restart
 * - Respects user's reduced motion preferences
 * - Performance optimized with proper cleanup
 * - Accessible with screen reader friendly content
 * 
 * Features:
 * - Variable typing speed for natural feel
 * - Dynamic typing indicator duration based on message complexity
 * - Message appearance animations (slide in from sides with elastic pop)
 * - Continuous loop with smooth transitions
 * - Proper state management and cleanup
 * - Reduced motion support
 */

/**
 * Enhanced Chatbot Animation Controller
 * Manages the typing animation sequence in the hero section
 */
class ChatbotAnimation {
    constructor() {
        // Enhanced animation configuration
        this.config = {
            typingSpeed: 35,                    // Even faster base milliseconds per character
            messageDelay: 2500,                 // Reduced delay between messages (2.5 seconds to read)
            initialDelay: 1000,                 // Standard delay before starting first loop
            loopDelay: 3000,                    // Good delay before restarting loop
            speedVariation: 10,                 // Minimal variation in typing speed
            typingIndicatorDuration: 700,       // Reduced base typing indicator duration
            enableTypingIndicator: true,        // Show typing indicator for AI messages
            enableMicroInteractions: true,      // Enable hover effects
            // NEW: Complexity-based timing configuration
            complexityTiming: {
                simple: 500,                    // Reduced: Short messages (< 50 chars)
                medium: 800,                    // Reduced: Medium messages (50-100 chars)
                complex: 1200,                  // Reduced: Long messages (> 100 chars)
                variation: 200                  // Reduced: ±100ms random variation
            },
            // ENHANCED2: Message pop animation timing
            messagePopTiming: {
                delay: 50,                      // Delay before pop animation starts
                duration: 500,                  // Duration of pop animation (matches CSS)
                stagger: 100                    // Stagger between elements if needed
            }
        };
        
        // DOM elements
        this.elements = {
            container: document.getElementById('chatMessages'),
            placeholder: document.querySelector('.animation-placeholder'),
            messages: []
        };
        
        // Animation state
        this.isAnimating = false;
        this.currentMessageIndex = 0;
        this.currentConversation = 0;           // Track which conversation to show
        this.loopTimeout = null;
        this.typingTimeout = null;
        this.indicatorTimeout = null;
        this.popTimeout = null;                 // ENHANCED2: For message pop timing
        
        // Check for reduced motion preference
        this.respectsReducedMotion = this.prefersReducedMotion();
        
        // Define three conversation sets
        this.conversations = [
            // Conversation 1 - Supplements
            [
                { type: 'user', text: 'Which longevity supplements have largest impact for a 50 year old woman?' },
                { type: 'ai', text: 'Omega-3, Vitamin D3 + K2, NMN, Spermidine, and Magnesium show strong benefits for women\'s healthspan after 50.' },
                { type: 'user', text: 'Does collagen work for skin?' },
                { type: 'ai', text: 'Yes, studies show hydrolyzed collagen can improve skin elasticity, hydration, and reduce wrinkles over time.' }
            ],
            // Conversation 2 - Blood tests
            [
                { type: 'user', text: 'What are the best blood tests to check health?' },
                { type: 'ai', text: 'Key tests include CBC, lipid panel, HbA1c, CRP, liver enzymes, vitamin D, and comprehensive metabolic panel.' },
                { type: 'user', text: 'What are the benefits of testing ferritin, for a man?' },
                { type: 'ai', text: 'High ferritin may signal inflammation or iron overload, increasing risks of heart disease, oxidative stress, and faster aging.' },
                { type: 'user', text: 'How to reduce cholesterol naturally?' },
                { type: 'ai', text: 'Psyllium husk and red yeast rice are both used to naturally lower LDL cholesterol in diet-based approaches.' }
            ],
            // Conversation 3 - Functional medicine
            [
                { type: 'user', text: 'What is functional medicine?' },
                { type: 'ai', text: 'Functional medicine addresses root causes of illness using personalized, systems-based approaches focused on prevention, lifestyle, and nutrition.' },
                { type: 'user', text: 'Does it cost a lot?' },
                { type: 'ai', text: 'Yes, functional medicine can be costly, often not covered by insurance, but offers deeper, personalized health insights.' }
            ]
        ];
        
        if (this.elements.container) {
            console.log('Enhanced chatbot animation initializing...');
            this.init();
        } else {
            console.log('Chatbot container not found - animation disabled');
        }
    }
    
    /**
     * Initialize chatbot animation
     */
    init() {
        // Collect all message elements
        this.elements.messages = Array.from(
            this.elements.container.querySelectorAll('.chat-message')
        );
        
        if (this.elements.messages.length === 0) {
            console.warn('No chat messages found');
            return;
        }
        
        // Store original text and prepare messages
        this.prepareMessages();
        
        // Apply configuration
        this.updateConfig(this.config);
        
        // Start animation loop with initial delay
        this.scheduleStart();
        
        console.log(`Enhanced chatbot animation initialized with ${this.elements.messages.length} messages`);
    }
    
    /**
     * Calculate message complexity based on length
     * @param {string} text - Message text
     * @returns {number} Duration in milliseconds
     */
    calculateMessageComplexity(text) {
        const length = text.length;
        const timing = this.config.complexityTiming;
        
        let baseDuration;
        if (length < 50) {
            baseDuration = timing.simple;
        } else if (length < 100) {
            baseDuration = timing.medium;
        } else {
            baseDuration = timing.complex;
        }
        
        // Add natural variation (±150ms)
        const variation = (Math.random() - 0.5) * timing.variation;
        const duration = Math.max(600, baseDuration + variation);
        
        console.log(`Message complexity: "${text.substring(0, 30)}..." (${length} chars) = ${duration}ms`);
        
        return duration;
    }
    
    /**
     * Prepare messages for animation
     * Store original text and set initial states
     */
    prepareMessages() {
        // Get the current conversation
        const currentConvo = this.conversations[this.currentConversation];
        
        this.elements.messages.forEach((message, index) => {
            const p = message.querySelector('p');
            if (p) {
                if (currentConvo[index]) {
                    // Update the text based on current conversation
                    p.dataset.originalText = currentConvo[index].text;
                    message.style.display = ''; // Make sure it's visible
                } else {
                    // Hide messages not used in current conversation
                    p.dataset.originalText = '';
                    message.style.display = 'none';
                }
                
                // Clear text content
                p.textContent = '';
                
                // Set initial state
                message.classList.remove('visible');
                
                // ENHANCED2: Remove any lingering animation classes
                p.classList.remove('message-popped');
                
                if (currentConvo[index]) {
                    console.log(`Message ${index + 1} prepared: "${p.dataset.originalText}"`);
                }
            }
        });
    }
    
    /**
     * Update animation configuration
     * @param {Object} newConfig - New configuration options
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        
        // Apply configuration to body classes for CSS
        document.body.classList.toggle('no-typing-indicator', !this.config.enableTypingIndicator);
        document.body.classList.toggle('no-micro-interactions', !this.config.enableMicroInteractions);
        
        console.log('Chatbot animation config updated:', this.config);
    }
    
    /**
     * Schedule animation start with initial delay
     */
    scheduleStart() {
        // Clear any existing timeout
        if (this.loopTimeout) {
            clearTimeout(this.loopTimeout);
        }
        
        // Respect reduced motion preferences
        const delay = this.respectsReducedMotion ? 500 : this.config.initialDelay;
        
        this.loopTimeout = setTimeout(() => {
            this.startAnimation();
        }, delay);
    }
    
    /**
     * Start the animation sequence
     */
    async startAnimation() {
        if (this.isAnimating) {
            console.log('Animation already running');
            return;
        }
        
        console.log('Starting enhanced chatbot animation sequence');
        this.isAnimating = true;
        this.currentMessageIndex = 0;
        
        // Add active class to placeholder for visual feedback
        if (this.elements.placeholder) {
            this.elements.placeholder.classList.add('chat-active');
        }
        
        try {
            // Get current conversation to know how many messages to animate
            const currentConvo = this.conversations[this.currentConversation];
            
            // Animate each message in sequence (only up to conversation length)
            for (let i = 0; i < currentConvo.length; i++) {
                const message = this.elements.messages[i];
                if (!message) continue;
                
                const p = message.querySelector('p');
                const text = p.dataset.originalText;
                const isAIMessage = message.classList.contains('from-ai');
                
                console.log(`Animating message ${i + 1}: "${text}"`);
                
                // Show message container with entrance animation
                message.classList.add('visible');
                
                // ENHANCEMENT: Add emphasis class for subtle highlight
                // To revert: Remove these 2 lines
                message.classList.add('message-emphasis');
                setTimeout(() => message.classList.remove('message-emphasis'), 700);
                
                // ENHANCED2: Small delay for message entrance animation to start
                await this.delay(this.config.messagePopTiming.delay);
                
                // Auto-scroll to latest message with improved logic
                this.scrollToLatestMessage(i === this.elements.messages.length - 1);
                
                // ENHANCEMENT: Natural response delay before AI starts thinking
                // To revert: Remove this entire if block
                if (isAIMessage && i > 0) {
                    // Calculate delay based on previous user message length
                    const prevMessage = this.elements.messages[i - 1];
                    if (prevMessage) {
                        const prevP = prevMessage.querySelector('p');
                        const prevText = prevP ? prevP.dataset.originalText : '';
                        
                        // Simulate "reading time" - longer messages take longer to read
                        let readingDelay;
                        if (prevText.length < 20) {
                            readingDelay = 400 + Math.random() * 200; // 400-600ms
                        } else if (prevText.length < 50) {
                            readingDelay = 600 + Math.random() * 300; // 600-900ms
                        } else {
                            readingDelay = 800 + Math.random() * 400; // 800-1200ms
                        }
                        
                        console.log(`AI reading delay for "${prevText.substring(0, 30)}..." (${prevText.length} chars): ${Math.round(readingDelay)}ms`);
                        await this.delay(readingDelay);
                    }
                }
                // END ENHANCEMENT
                
                // Show typing indicator for AI messages with dynamic duration
                if (isAIMessage && this.config.enableTypingIndicator) {
                    const complexityDuration = this.calculateMessageComplexity(text);
                    await this.showTypingIndicator(p, complexityDuration);
                }
                
                // Type the message
                await this.typeMessage(p, text);
                
                // ENHANCED2: Trigger message pop effect after typing completes
                this.triggerMessagePop(p);
                
                // Final scroll to ensure message is fully visible
                this.scrollToLatestMessage(i === currentConvo.length - 1);
                
                // Wait before next message (except for last message)
                if (i < this.elements.messages.length - 1) {
                    // Shorter delay between user message and AI response
                    const nextMessage = this.elements.messages[i + 1];
                    const isNextAI = nextMessage.classList.contains('from-ai');
                    const isCurrentUser = this.elements.messages[i].classList.contains('from-user');
                    
                    if (isCurrentUser && isNextAI) {
                        // Quick 500ms delay before AI starts thinking
                        await this.delay(500);
                    } else {
                        // Normal delay between other messages
                        await this.delay(this.config.messageDelay);
                    }
                }
                
                this.currentMessageIndex = i + 1;
            }
            
            console.log('Animation sequence completed');
            
            // Wait before restarting the loop
            await this.delay(this.config.loopDelay);
            
            // Reset and restart (now async)
            await this.resetAnimation();
            
        } catch (error) {
            console.error('Error during animation:', error);
            this.resetAnimation();
        }
    }
    
    /**
     * Show 3-dot typing indicator before AI messages
     * @param {Element} element - Element to show indicator in
     * @param {number} duration - Duration based on message complexity
     */
    async showTypingIndicator(element, duration) {
        if (this.respectsReducedMotion) {
            return; // Skip indicator for reduced motion
        }
        
        const typingHTML = `
            <span class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </span>
        `;
        
        element.innerHTML = typingHTML;
        
        // Use the complexity-based duration
        await this.delay(duration);
        
        // Clear the indicator
        element.innerHTML = '';
        // No pause - go straight to typing
    }
    
    /**
     * Type out a message with realistic timing
     * @param {Element} element - Element to type into
     * @param {string} text - Text to type
     */
    async typeMessage(element, text) {
        return new Promise((resolve) => {
            if (this.respectsReducedMotion) {
                // Skip typing animation for reduced motion
                element.textContent = text;
                resolve();
                return;
            }
            
            // Add typing cursor class
            element.classList.add('typing-cursor');
            
            let currentIndex = 0;
            
            // ENHANCEMENT: Variable typing speed based on message length
            // To revert: Replace with: const baseSpeed = this.config.typingSpeed;
            const messageLength = text.length;
            let baseSpeed;
            if (messageLength < 30) {
                baseSpeed = 25; // Very fast for short messages
            } else if (messageLength < 60) {
                baseSpeed = 30; // Fast for medium messages
            } else if (messageLength < 100) {
                baseSpeed = 35; // Normal speed
            } else {
                baseSpeed = 40; // Slightly slower for long messages
            }
            console.log(`Typing speed for "${text.substring(0, 20)}..." (${messageLength} chars): ${baseSpeed}ms`);
            // END ENHANCEMENT
            
            const typeNextCharacter = () => {
                if (currentIndex <= text.length && this.isAnimating) {
                    // Update text content
                    element.textContent = text.slice(0, currentIndex);
                    currentIndex++;
                    
                    if (currentIndex <= text.length) {
                        // Calculate next typing delay with variation
                        const variation = (Math.random() - 0.5) * this.config.speedVariation;
                        const delay = Math.max(20, baseSpeed + variation);
                        
                        // Add longer pauses after punctuation for natural feel
                        const lastChar = text[currentIndex - 2];
                        const punctuationDelay = /[.!?]/.test(lastChar) ? 60 : 0;
                        
                        this.typingTimeout = setTimeout(typeNextCharacter, delay + punctuationDelay);
                    } else {
                        // Typing complete
                        element.classList.remove('typing-cursor');
                        resolve();
                    }
                } else {
                    // Animation stopped or completed
                    element.classList.remove('typing-cursor');
                    resolve();
                }
            };
            
            // Start typing
            typeNextCharacter();
        });
    }
    
    /**
     * ENHANCED2: Trigger message pop effect
     * @param {Element} element - Message element to pop
     */
    triggerMessagePop(element) {
        if (this.respectsReducedMotion) {
            return; // Skip pop effect for reduced motion
        }
        
        // The CSS animation will handle the pop effect
        // We just need to ensure it's triggered by adding/removing classes if needed
        element.classList.add('message-popped');
    }
    
    /**
     * Auto-scroll to show the latest message
     * @param {boolean} isLastMessage - Whether this is the last message
     */
    scrollToLatestMessage(isLastMessage = false) {
        if (this.elements.container) {
            // Calculate the scroll position
            const containerHeight = this.elements.container.clientHeight;
            const scrollHeight = this.elements.container.scrollHeight;
            const currentScroll = this.elements.container.scrollTop;
            
            // For the last message, ensure it's fully visible above the gradient
            if (isLastMessage) {
                // Minimal offset - just enough to ensure visibility
                const bottomOffset = 15;
                const targetScroll = scrollHeight - containerHeight + bottomOffset;
                
                // Only scroll if needed
                if (targetScroll > currentScroll) {
                    this.elements.container.scrollTop = targetScroll;
                }
            } else {
                // For other messages, just ensure they're visible
                const targetScroll = scrollHeight - containerHeight;
                if (targetScroll > currentScroll) {
                    this.elements.container.scrollTop = targetScroll;
                }
            }
        }
    }
    
    /**
     * Reset animation to initial state
     */
    async resetAnimation() {
        console.log('Resetting chatbot animation');
        
        this.isAnimating = false;
        
        // Clear any pending timeouts
        if (this.typingTimeout) {
            clearTimeout(this.typingTimeout);
            this.typingTimeout = null;
        }
        
        if (this.indicatorTimeout) {
            clearTimeout(this.indicatorTimeout);
            this.indicatorTimeout = null;
        }
        
        if (this.popTimeout) {
            clearTimeout(this.popTimeout);
            this.popTimeout = null;
        }
        
        // Fade out all messages
        this.elements.messages.forEach(message => {
            message.classList.add('fade-out');
        });
        
        // Wait for fade-out transition to complete (0.8s as defined in CSS)
        await this.delay(800);
        
        // Remove active class from placeholder
        if (this.elements.placeholder) {
            this.elements.placeholder.classList.remove('chat-active');
        }
        
        // Reset all messages
        this.elements.messages.forEach(message => {
            message.classList.remove('visible', 'fade-out');
            const p = message.querySelector('p');
            if (p) {
                p.textContent = '';
                p.classList.remove('typing-cursor', 'message-popped');
                p.innerHTML = ''; // Clear any typing indicators
                p.style.animation = ''; // Reset animation property
            }
        });
        
        // Reset scroll position to top
        if (this.elements.container) {
            this.elements.container.scrollTop = 0;
        }
        
        // Small pause before restarting for visual clarity
        await this.delay(500);
        
        // Switch to the next conversation
        this.currentConversation = (this.currentConversation + 1) % this.conversations.length;
        console.log(`Switching to conversation ${this.currentConversation + 1}`);
        
        // Prepare messages with new conversation
        this.prepareMessages();
        
        // Schedule restart
        this.scheduleStart();
    }
    
    /**
     * Create a delay promise
     * @param {number} ms - Milliseconds to delay
     * @returns {Promise} Delay promise
     */
    delay(ms) {
        return new Promise(resolve => {
            const timeout = setTimeout(resolve, this.respectsReducedMotion ? ms / 10 : ms);
            // Store timeout for cleanup if needed
            this.indicatorTimeout = timeout;
        });
    }
    
    /**
     * Check if user prefers reduced motion
     * @returns {boolean} True if reduced motion is preferred
     */
    prefersReducedMotion() {
        if (typeof window.matchMedia !== 'function') return false;
        
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        return mediaQuery.matches;
    }
    
    /**
     * Pause animation (useful for when element is not visible)
     */
    pause() {
        if (this.isAnimating) {
            console.log('Pausing chatbot animation');
            this.isAnimating = false;
            
            if (this.typingTimeout) {
                clearTimeout(this.typingTimeout);
                this.typingTimeout = null;
            }
            
            if (this.loopTimeout) {
                clearTimeout(this.loopTimeout);
                this.loopTimeout = null;
            }
            
            if (this.indicatorTimeout) {
                clearTimeout(this.indicatorTimeout);
                this.indicatorTimeout = null;
            }
            
            if (this.popTimeout) {
                clearTimeout(this.popTimeout);
                this.popTimeout = null;
            }
        }
    }
    
    /**
     * Resume animation
     */
    resume() {
        if (!this.isAnimating) {
            console.log('Resuming chatbot animation');
            this.resetAnimation();
        }
    }
    
    /**
     * Destroy animation and clean up
     */
    destroy() {
        console.log('Destroying chatbot animation');
        
        // Stop animation
        this.pause();
        
        // Remove all classes and reset content
        this.elements.messages.forEach(message => {
            message.classList.remove('visible');
            const p = message.querySelector('p');
            if (p) {
                p.textContent = p.dataset.originalText || '';
                p.classList.remove('typing-cursor', 'message-popped');
                p.innerHTML = ''; // Clear any typing indicators
                p.style.animation = ''; // Reset animation property
            }
        });
        
        // Remove active state from placeholder
        if (this.elements.placeholder) {
            this.elements.placeholder.classList.remove('chat-active');
        }
        
        // Remove body classes
        document.body.classList.remove('no-typing-indicator', 'no-micro-interactions');
        
        this.isAnimating = false;
    }
}

/**
 * Initialize enhanced chatbot animation system
 */
function initChatbotAnimation() {
    // Small delay to ensure DOM is fully rendered
    setTimeout(() => {
        // Create global chatbot animation instance
        window.chatbotAnimation = new ChatbotAnimation();
        
        // Make control methods globally available
        window.pauseChatbot = () => {
            if (window.chatbotAnimation) {
                window.chatbotAnimation.pause();
            }
        };
        
        window.resumeChatbot = () => {
            if (window.chatbotAnimation) {
                window.chatbotAnimation.resume();
            }
        };
        
        window.updateChatbotConfig = (config) => {
            if (window.chatbotAnimation) {
                window.chatbotAnimation.updateConfig(config);
            }
        };
        
        // Example: Update configuration
        // window.updateChatbotConfig({ typingSpeed: 40, enableTypingIndicator: true });
        
    }, 500);
}

/**
 * Initialize when DOM is ready
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbotAnimation);
} else {
    initChatbotAnimation();
}

// Optional: Pause animation when page is not visible (performance optimization)
if (typeof document.addEventListener === 'function') {
    document.addEventListener('visibilitychange', () => {
        if (window.chatbotAnimation) {
            if (document.hidden) {
                window.chatbotAnimation.pause();
            } else {
                // Resume after a short delay to allow for page reflow
                setTimeout(() => {
                    window.chatbotAnimation.resume();
                }, 1000);
            }
        }
    });
}

// Export for ES6 modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ChatbotAnimation, initChatbotAnimation };
}