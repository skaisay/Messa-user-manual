# Норвежский языковой ассистент (Norwegian Language Assistant)

## Overview

Норвежский языковой ассистент is a specialized web-based language learning application built with vanilla HTML, CSS, and JavaScript. The application provides an intelligent chat interface for learning Norwegian language with Russian explanations. It features glassmorphism design effects, animated backgrounds, and an optimized database structure for handling large vocabulary datasets.

## System Architecture

### Frontend Architecture
- **Technology Stack**: Pure HTML5, CSS3, and JavaScript (no frameworks)
- **Design Pattern**: Single Page Application (SPA) with DOM manipulation
- **Styling Approach**: CSS custom properties (variables) for theming with glassmorphism effects
- **Icon System**: Feather Icons via CDN for consistent iconography
- **Responsive Design**: Mobile-first approach using CSS Grid and Flexbox

### Component Structure
- **Static Assets**: All styling and behavior contained in single files
- **Theme System**: CSS custom properties enable seamless light/dark mode switching
- **Message System**: Dynamic DOM manipulation for chat message rendering
- **Loading States**: Built-in loading indicators for user feedback

## Key Components

### 1. Application Shell
- **Header**: Contains app title with icon and theme toggle button
- **Main Chat Area**: Scrollable message container with welcome message
- **Input Interface**: (Implementation pending - likely message input and send functionality)

### 2. Theme Management
- **CSS Variables**: Comprehensive theming system using custom properties
- **Theme Toggle**: JavaScript-driven theme switching between light and dark modes
- **Persistence**: Theme preference likely stored in localStorage

### 3. Message System
- **Message Types**: User and assistant message differentiation
- **Avatar System**: Icon-based avatars for message attribution
- **Welcome Message**: Pre-loaded assistant greeting in Russian

### 4. Visual Design
- **Glassmorphism**: Semi-transparent backgrounds with blur effects
- **Color Palette**: Professional blue accent colors with neutral grays
- **Typography**: Clean, readable font hierarchy
- **Shadows**: Layered shadow system for depth

## Data Flow

### Message Handling
1. User input captured (implementation pending)
2. Message displayed in chat interface
3. Loading indicator shown during processing
4. Assistant response rendered and displayed
5. Chat history maintained in DOM

### Theme Management
1. Theme toggle button clicked
2. CSS custom properties updated
3. Theme preference stored locally
4. Interface re-renders with new theme

## External Dependencies

### CDN Resources
- **Feather Icons**: `https://cdnjs.cloudflare.com/ajax/libs/feather-icons/4.29.0/feather.min.css`
  - Provides consistent iconography
  - Lightweight and scalable SVG icons
  - Used for UI elements (bot, sun, moon, message icons)

### Potential Integrations
- AI/Chat API service (implementation pending)
- Analytics service (Google Analytics, etc.)
- Error tracking service (Sentry, etc.)

## Deployment Strategy

### Static Hosting
- **Deployment Type**: Static website suitable for any web server
- **Hosting Options**: GitHub Pages, Netlify, Vercel, or traditional web hosting
- **Build Process**: No build step required - direct file serving
- **CDN**: Leverage CDN for Feather Icons, consider CDN for main assets

### Performance Considerations
- Minimize HTTP requests through file consolidation
- Optimize images and assets
- Implement service worker for offline functionality
- Consider lazy loading for chat history

## User Preferences

Preferred communication style: Simple, everyday language.

## GitHub Pages PWA Fix

### Problem
When installing PWA app from GitHub Pages through Safari, 404 error appears despite browser version working correctly.

### Solution Applied
1. **Updated manifest.json**: Changed absolute paths to relative paths (`start_url: "./"`, `scope: "./"`)
2. **Updated service worker**: Changed all cached URLs to relative paths (`./index.html`, etc.)
3. **Created index-github.html**: Special version with all relative paths for GitHub Pages deployment
4. **Fixed PWA meta tags**: Added proper meta tags for iOS and Android PWA support

### Files Modified
- manifest.json: Updated start_url, scope, and shortcuts to use relative paths
- sw.js: Updated STATIC_CACHE_URLS and fallback paths
- index-github.html: Created GitHub Pages optimized version
- github-pages-fix.md: Documentation for the fix

## Changelog

Changelog:
- July 02, 2025. Initial setup
- July 02, 2025. Complete redesign with black background, glassmorphism effects, animated AI avatars, and modern ChatGPT-style interface
- July 02, 2025. Fixed GitHub Pages PWA installation issue with relative paths

## Development Notes

### Current Implementation Status
- ✅ Basic HTML structure and styling
- ✅ Theme switching system
- ✅ Welcome message and message container
- ✅ Loading indicator component
- ⏳ JavaScript functionality (partially visible in HTML)
- ⏳ Message input and sending logic
- ⏳ AI integration and response handling
- ⏳ Chat history persistence

### Architectural Decisions

**Technology Choice**: Vanilla JavaScript was chosen over frameworks for:
- Simplicity and minimal dependencies
- Fast loading times
- Easy deployment and maintenance
- Learning/educational purposes

**Theming System**: CSS custom properties provide:
- Consistent theming across components
- Easy theme switching without CSS class manipulation
- Better performance than JavaScript-based theming
- Future extensibility for additional themes

**Russian Language**: Application is built for Russian-speaking users:
- All UI text in Russian
- Cultural considerations for user experience
- Potential localization framework for future expansion