# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a modern AI solutions homepage built with vanilla HTML, CSS, and JavaScript. The project demonstrates enterprise-grade web development practices with a focus on mobile card flip functionality and modern CSS techniques.

## Technical Stack

- **HTML5**: Semantic markup with accessibility features
- **CSS**: Modern CSS with CSS Custom Properties, Grid, Flexbox, and CSS Layers
- **JavaScript**: Vanilla ES6+ with class-based components
- **No Build Process**: Direct file serving, no bundling or transpilation required

## Development Commands

Since this is a static website with no build process:

```bash
# Serve locally (choose one):
python -m http.server 8000
npx serve .
# Or use VS Code Live Server extension
```

## Architecture

### CSS Organization (Layered Architecture)
- `css/00-variables.css`: Design tokens and CSS custom properties
- `css/01-reset.css`: Base styles and font declarations
- `css/02-layout.css`: Container systems, grid layouts, header structure
- `css/03-sections.css`: Page-specific section styles
- `css/04-components.css`: Reusable UI components (buttons, cards, forms)
- `css/05-animations.css`: Keyframes, transitions, animation utilities

All CSS is imported through `main.css` in dependency order.

### JavaScript Modules
- `js/utilities.js`: Shared helper functions and utilities
- `js/navigation.js`: Header behavior, mobile menu, scroll effects
- `js/carousel.js`: Card carousel and flip functionality (desktop 3D flip, mobile toggle)
- `js/chatbot-animation.js`: Hero section chat animation sequencing

### Key Features

#### Card Flip Implementation (Strategic Expertise Section)
- **Desktop**: 3D transform with `rotateY(180deg)` and `preserve-3d`
- **Mobile**: Simple show/hide toggle for performance
- **Gradient Bar**: Mobile-only colored bar that appears on front face only
- **Accessibility**: Full keyboard navigation and ARIA attributes

#### Responsive Breakpoint
- Primary breakpoint: `768px` (mobile/desktop divide)
- Mobile-first approach with progressive enhancement

## Modern CSS Requirements

### Mandatory Patterns
- CSS Custom Properties for all repeated values
- CSS Logical Properties (`block-size`, `inline-size`, `inset`)
- Modern functions: `clamp()`, `min()`, `max()` for fluid scaling
- CSS Layers (`@layer`) for cascade control
- Modern media queries: `@media (width >= 768px)`

### Forbidden Patterns
- ❌ CSS floats for layout
- ❌ Clearfix hacks or magic numbers
- ❌ `!important` declarations (unless critical)
- ❌ Vendor prefixes (unless required for current browsers)
- ❌ Inline styles for layout

## Critical Implementation Details

### Mobile Card Behavior
1. Cards display in vertical stack (no carousel)
2. Gradient bar (`:before` pseudo-element) visible on front face only
3. Click toggles between front/back without 3D transform
4. All text remains centered on both faces

### Desktop Card Behavior
1. 2-card carousel view (2 of 3 cards visible)
2. Full 3D flip animation on click
3. Arrow navigation and dot indicators
4. Hover effects with gradient backgrounds

### Navigation Behavior
- Desktop: Fixed header with squash effect on scroll
- Mobile: Hamburger menu that maintains position (doesn't drift)

## Testing Approach

Manual testing across devices and browsers:
1. Test card flip functionality on both desktop and mobile
2. Verify gradient bar behavior on mobile
3. Check navigation positioning during scroll
4. Test keyboard accessibility
5. Verify touch gestures on mobile devices

## Performance Considerations

- Font preloading for critical text rendering
- CSS-only animations where possible
- Debounced resize handlers
- Minimal JavaScript for core functionality
- No external dependencies or frameworks

## Chatbot Animation Layout Solution

### Problem History
The chatbot animation in the hero section had multiple issues:
1. Multiple gradient boxes appearing with 90-degree corners instead of rounded corners
2. AI chat messages clipping at the bottom (especially the "elasticity" message)
3. When trying to fix clipping with excessive bottom padding (200px), messages were pushed too high, causing the first messages to be clipped at the top
4. The oversized chatbot was affecting the logo marquee spacing below

### Final Working Solution

#### Structure
```
animation-placeholder (48rem max height)
  └── chatbot-container (device-frame class)
      ├── Gray frame: 20px padding with #DEE2E6 background
      ├── Gradient background: ::after pseudo-element with 10px rounded corners
      └── chat-messages container
          └── Individual message bubbles
```

#### Key CSS Principles That Work

1. **Device Frame Effect**
   - Use `padding: 20px` instead of `border: 20px solid` for the frame
   - Apply gray background color to create frame appearance
   - Gradient goes on `::after` pseudo-element with `inset: 20px`

2. **Message Container Layout**
   ```css
   .chat-messages {
       display: flex;
       flex-direction: column;
       justify-content: flex-end; /* KEY: Push messages to bottom naturally */
       padding: 30px 20px 30px 20px; /* Balanced padding, not excessive */
       overflow-y: auto;
       overflow-x: hidden;
   }
   ```

3. **Proper Rounded Corners**
   - Container: `border-radius: 24px`
   - Gradient (::after): `border-radius: 10px` (not 4px - needs to be visible)
   - Messages container: `border-radius: 10px` to match

4. **Height Management**
   - animation-placeholder: `max-block-size: 48rem` (not 56rem)
   - Hero section: `padding-block-end: 15rem` for proper spacing
   - Small 20px spacer after last message, not 100px+

### What NOT to Do
- Don't use excessive bottom padding (200px) to prevent clipping - it pushes everything up
- Don't use `background-image: none !important` on all children - it removes AI message gradients
- Don't make the animation-placeholder too tall - it affects page layout
- Don't use multiple pseudo-elements for gradients - causes duplicate boxes
- Don't use `overflow: visible` on containers that need rounded corners

### Testing Checklist
1. ✓ All 4 chat messages visible without clipping
2. ✓ Messages start from bottom and build up
3. ✓ Gradient background has visible rounded corners
4. ✓ No duplicate gradient boxes
5. ✓ Logo marquee not affected by chatbot height
6. ✓ AI messages have pink gradient background
7. ✓ Text wraps properly without cutting off

### Future Modifications
If message text changes and causes clipping:
- Adjust the specific message's max-width slightly narrower
- Add small margin-bottom to that specific message
- Don't increase container padding excessively

Remember: The solution is about proper flexbox layout with `justify-content: flex-end`, not about adding massive padding.

### Device Frame Removal - Alignment Adjustment
When the device frame is removed:
- The chat messages container has `padding: 20px 40px 20px 20px` (increased right padding)
- This aligns the AI chat bubbles with the nav CTA gutter position
- Without the frame's 20px padding, we need extra right padding to maintain visual alignment

## Device Frame Removal Test (2025-08-01)

### What Was Changed
Temporarily disabled the device frame on the homepage animated chatbot hero for testing. All changes are easily reversible.

### Files Modified

#### 1. CSS: `05-animations.css`
- **Device frame styles** (lines 227-260): Commented out `.chatbot-container.device-frame` block
  - Removed 20px padding
  - Removed white frame background (rgba(255, 255, 255, 0.6))
  - Removed inner gradient positioning
- **Chat message padding** (lines 338-360): Commented out device frame message padding adjustments
- **Mobile padding** (lines 748-757): Commented out mobile device frame adjustments

#### 2. CSS: `04-components.css`  
- **Shadow system** (lines 715-721): Commented out multi-layer shadow on `.animation-placeholder`
- **Hover state** (lines 759-766): Disabled hover transform and shadow effects
- **Active state** (lines 768-775): Disabled active transform effects

### How to Rollback
To restore the device frame, uncomment the blocks marked with:
- `/* TO ROLLBACK: Uncomment this block when restoring device frame */`
- `/* TO ROLLBACK: Uncomment the box-shadow below to restore */`
- `/* TO ROLLBACK: Uncomment to restore hover effect */`
- `/* TO ROLLBACK: Uncomment to restore active state */`

### Important Notes
- Chat bubbles remain in exact same position - only visual frame removed
- No structural changes to positioning or animation timing
- All changes clearly marked for easy identification