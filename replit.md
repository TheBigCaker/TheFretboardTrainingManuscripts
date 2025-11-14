# The Fretboard Training Manuscripts

A music theory and fretboard visualization tool for guitarists, bassists, and other stringed instrument players.

## Overview

This is an interactive web application that helps musicians:
- Visualize scales and modes on various stringed instruments
- Learn chord progressions and diatonic harmony
- Practice with generated tablature sequences
- Understand music theory fundamentals

**Current State**: Fully functional frontend application built with Vite and vanilla JavaScript. The app uses external CDN libraries for music theory (Tonal.js), audio synthesis (Tone.js), and chord diagrams (SVGuitar).

## Recent Changes

### November 14, 2025
- **CRITICAL FIX: Tablature Rendering** - Completely rewrote rendering logic to display proper guitar tablature
  - Changed from string-first iteration (incorrect) to beat-first iteration (correct)
  - Now displays all 6 strings stacked vertically at each beat (standard guitar tab format)
  - Added string labels column (e4, B3, G3, D3, A2, E2) on left side
  - Measure separators every 4 beats, bar breaks every 16 beats
  - Uses vertical flex columns (20px×16px cells, monospaced Courier font)
  - **Unified Display**: Combined three separate phases into ONE continuous training tablature (all 512 beats)
- **CRITICAL FIX: Chord Diagrams** - Fixed SVGuitar library integration
  - Updated CDN URL to correct version: svguitar@2.4.1/dist/svguitar.umd.js
  - Fixed JavaScript constructor: `new svguitar.SVGuitarChord()` instead of `new SVGuitarChord()`
  - Added dark color configuration (#111) to ensure diagrams are visible on white backgrounds
  - Chord diagrams now render properly with visible colors when diatonic chord buttons are clicked
- **Manuscript Method Section Redesign**: Refactored tab section to match original minimalist design
  - Implemented clean monochrome styling with precise monospaced typography (Courier New stack)
  - Removed all decorative elements (gradients, shadows, rounded corners, vivid colors)
  - Applied precise grid system with 1px/2px staff line weights
  - Synchronized Circle of Fifths with Root Note dropdown via setActiveKey() function
- Moved static assets (CSV, chord_shapes.json) to public/ directory for production builds

### November 13, 2025
- Imported from GitHub and configured for Replit environment
- Created Vite configuration for development server on port 5000
- Added npm scripts for dev, build, and preview
- Configured deployment settings for production (autoscale)
- Set up development workflow with webview output

## Project Architecture

### Technology Stack
- **Build Tool**: Vite 7.2.2
- **Styling**: Tailwind CSS (CDN), custom CSS
- **Music Theory**: Tonal.js (CDN)
- **Audio**: Tone.js (CDN)
- **Chord Diagrams**: SVGuitar (CDN)
- **Language**: JavaScript (ES Modules)

### File Structure
- `index.html` - Main HTML template with controls and layout
- `main.js` - Core application logic for fretboard visualization and tablature generation
- `database.js` - Instrument tunings and scale/mode definitions
- `style.css` - Custom styles and component styling
- `chord_shapes.json` - Chord fingering data
- `vite.config.js` - Vite development and build configuration
- `package.json` - Project dependencies and scripts

### Key Features
1. **Fretboard Visualization**: Interactive fretboard display showing scale patterns
2. **Multiple Instruments**: Support for 6/7-string guitars, 4/5-string basses, mandolin, and banjo
3. **Scale Library**: Common scales, modes, minor scales, and exotic scales
4. **Interactive Harmony**: Circle of fifths, diatonic chords, and common progressions
5. **Tablature Training**: Generated tab sequences with customizable tempo and formatting
6. **Educational Content**: Built-in music theory fundamentals with accordion panels

## Development

### Running Locally
```bash
npm install
npm run dev
```
The app will run on http://0.0.0.0:5000

### Building for Production
```bash
npm run build
npm run preview
```

## Configuration Notes

- **Port**: Development server runs on port 5000 (required for Replit webview)
- **Host**: Configured to bind to 0.0.0.0 for external access
- **HMR**: Hot Module Replacement configured for port 5000
- **Deployment**: Uses autoscale deployment target with Vite preview server
