# Removed Features Tracking

This file tracks all features that were removed while debugging the shimmer/wobble issue in the chat bubbles.

## JavaScript Features Removed

### 1. Chatbot Animation Script
- **File**: `index.html` line 420
- **What**: Entire `chatbot-animation.js` script disabled
- **Original**: `<script src="js/chatbot-animation.js"></script>`
- **Why**: Was clearing text and running animations

## CSS Features Removed

### 2. Message Animations
- **File**: `css/05-animations.css`
- **What**: Message pop animations for user and AI messages
- **Original**: 
  ```css
  @keyframes messagePopLeft {
      0%   { 
          transform: scale(0.95) translateY(10px) translateX(-15px);
          opacity: 0;
      }
      100% { 
          transform: scale(1) translateY(0) translateX(0);
          opacity: 1;
      }
  }
  
  @keyframes messagePopRight {
      0%   { 
          transform: scale(0.95) translateY(10px) translateX(15px);
          opacity: 0;
      }
      100% { 
          transform: scale(1) translateY(0) translateX(0);
          opacity: 1;
      }
  }
  ```

### 3. Typing Indicator Animations
- **File**: `css/05-animations.css`
- **What**: Dot pulse animations
- **Original**: 
  ```css
  animation: dotPulse1 var(--typing-cycle-duration) infinite;
  ```

### 4. Cursor Blink Animation
- **File**: `css/05-animations.css`
- **What**: Typing cursor blink
- **Original**: `animation: blink 1s infinite;`

### 5. Hover Effects
- **File**: `css/05-animations.css`
- **What**: All hover transforms and box-shadow changes
- **Original**: 
  ```css
  transform: translateY(-2px);
  /* Plus enhanced box-shadows on hover */
  ```

### 6. Visual Effects
- **File**: `css/05-animations.css`
- **What**: Various visual enhancements
- **Items**:
  - `backdrop-filter: blur(14px)` on user messages
  - `will-change: transform, opacity` on typing dots
  - `transform: translateZ(0)` on chatbot container
  - `will-change: transform, box-shadow` on chatbot container
  - Gradient background on AI messages (changed to solid color)
  - `text-rendering: optimizeLegibility`
  - `scroll-behavior: smooth`
  - `hyphens: auto` properties

### 7. Animations and Transitions
- **File**: `css/05-animations.css`
- **What**: Various animations
- **Items**:
  - `chatbotGradientShift` animation
  - `glassReflection` animation
  - `chatbotPulse` animation
  - `aiGlowPulseSoft` animation
  - Elastic easing changed to smooth easing
  - Message transition animations
  - Mobile messagePop animation

### 8. Pseudo Elements
- **File**: `css/05-animations.css`
- **What**: Glass morphism effects
- **Items**:
  - `.chatbot-container::before` (rainbow reflection)
  - `.chatbot-container::after` (noise texture)
  - Bottom gradient overlay on `.chat-messages::after`

### 9. Borders
- **File**: `css/05-animations.css`
- **What**: Message borders
- **Items**:
  - User message: `border: 1px solid rgba(255, 255, 255, 0.8)`
  - AI message: `border: 1px solid rgba(255, 255, 255, 0.3)`

### 10. Box Shadows
- **File**: `css/05-animations.css`
- **What**: Inset shadows
- **Items**:
  - Inset shadows on user messages
  - Inset shadows and glow effects on AI messages

### 11. Chatbot Container Gradient Background
- **File**: `css/05-animations.css`
- **What**: Gradient background on chatbot container
- **Original**:
  ```css
  background: linear-gradient(
      135deg,
      #FFFCF9 0%,
      #FFFFF9 25%,
      #FFF9F2 50%,
      #FFF2F9 75%,
      #FFFCF9 100%
  );
  background-size: 200% 200%;
  background-position: 0% 0%;
  ```
- **Why**: Temporarily removed while debugging shimmer issue

## Order to Restore Features

Once shimmer is fixed, restore in this order:

1. **Basic animations first**:
   - Cursor blink
   - Typing indicator dots

2. **Visual enhancements**:
   - Borders on messages
   - Gradient background on AI messages
   - Box shadows (without inset first)

3. **Message animations**:
   - Simple fade-in only
   - Then add slide animations

4. **Interactive features**:
   - Hover effects (without transforms first)
   - Then add hover transforms

5. **Advanced effects**:
   - Backdrop filters
   - Glass morphism pseudo-elements
   - Text rendering optimizations

6. **Full animation system**:
   - Re-enable chatbot-animation.js
   - Restore elastic easing if needed

## Testing Protocol

After each restoration:
1. Check for shimmer/wobble
2. Test on different browsers
3. Check mobile responsiveness
4. Verify performance