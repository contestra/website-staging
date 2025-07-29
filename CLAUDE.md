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