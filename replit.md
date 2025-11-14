# The Fretboard Training Manuscripts

A music theory and fretboard visualization tool for guitarists, bassists, and other stringed instrument players.

## Overview

This is an interactive web application that helps musicians:
- Visualize scales and modes on various stringed instruments
- Learn chord progressions and diatonic harmony
- Practice with generated tablature sequences
- Understand music theory fundamentals

**Current State**: Fully functional frontend application built with Vite and vanilla JavaScript. The app uses external CDN libraries for music theory (Tonal.js) and audio synthesis (Tone.js). Chord diagrams now use custom text-based ASCII rendering for better reliability and customization.

## Recent Changes

### November 14, 2025 (Third Session)
- **MAJOR REFACTOR: Text-Based Chord Diagrams** - Replaced SVGuitar library with custom ASCII/text-based chord rendering
  - Removed SVGuitar CDN dependency from index.html completely
  - Created renderTextChordDiagram() function using Unicode box-drawing characters (━, ─, ┬, │)
  - Chord diagrams now display in Courier New monospace font matching tablature aesthetic
  - Shows string indicators (x = muted, o = open) above diagram
  - Displays fret position marker for barre chords (e.g., [5] for 5th position)
  - Renders finger numbers (1-4) or dots (●) on fretboard grid
- **FEATURE: Multiple Chord Positions** - Display all voicings for each chord side-by-side
  - Modified displayChord() to render ALL voicings from chord_shapes.json (Open, Barre shapes, etc.)
  - Diagrams arranged horizontally with 2rem gap between each position
  - Each position shows its own title (e.g., "C Major (Open)", "C Major (A-Shape Barre)")
- **FEATURE: Fallback Chord Generation** - Auto-generate basic chord shapes for missing chords
  - Implemented generateFallbackChord() using Tonal.js chord parsing
  - Analyzes chord notes and finds nearest positions on each string (within first 5 frets)
  - Generates simple fingering for chords not in database (diminished chords, complex voicings)
  - Labeled as "(Auto-Generated)" to distinguish from database chords
- **CSS Styling** - Added comprehensive styles for text-based chord diagrams
  - .chord-diagrams-container: Flexbox layout for multiple diagrams
  - .chord-diagram-item: Individual diagram box with 2px border, white background
  - .chord-fret-row and .chord-finger-row: Grid rendering for fretboard display
  - Consistent with tablature monospace aesthetic (Courier New, #111 black text)

### November 14, 2025 (Second Session)
- **CRITICAL FIX: Sharp/Flat Symbol Display** - Replaced placeholder '?' characters with proper Unicode symbols
  - Updated CHROMATIC_NOTES array to use ♯ (sharp) and ♭ (flat) instead of '?'
  - Fixed Circle of Fifths to display F♯, D♭, A♭, E♭, B♭ with proper symbols
  - All note names throughout UI now display correctly with musical notation
- **CRITICAL FIX: SVGuitar Chord Diagram Rendering** - Fixed blank chord diagram boxes
  - Converted chord data format from our frets/fingers arrays to SVGuitar's required fingers array format [[string, fret, label]]
  - Fixed string numbering: SVGuitar uses 6=thickest to 1=thinnest
  - Added dynamic string count detection from chord data (supports 4-7 string instruments)
  - Added console logging for debugging chord data conversion
  - Chord diagrams now render properly with correct fingering positions
- **CRITICAL FIX: Dynamic Tablature Regeneration** - Made tablature responsive to dropdown changes
  - Added event listeners to instrument, root note, and scale/mode dropdowns
  - Implemented transposeTabData() function to transpose tablature by semitone intervals
  - Implemented instrument-aware rendering using TUNINGS data from database.js
  - Normalized string identifiers to use label+octave format (e4, B3, G3, etc.) matching CSV data
  - Created renderAllPhasesForInstrument() to render tablature for any selected instrument
  - Tablature now dynamically updates when user changes instrument (guitar/bass/mandolin/banjo), root note, or scale/mode
  - Supports all instruments: 6/7-string guitar, 4/5-string bass, mandolin, 5-string banjo
  - Added defensive logging to warn about missing string data during rendering

### November 14, 2025 (First Session)
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
  - Added missing chord shapes: A, E, B, Bm, F#m, C#m, G#m, D#dim to chord_shapes.json
  - Chord diagrams now render properly with visible colors when diatonic chord buttons are clicked
- **Tablature Text Sizing** - Increased tablature text size for better readability
  - Font size increased from 13px to 18px bold
  - Cell dimensions increased from 20×16px to 30×24px
  - String labels increased from 12px to 16px bold
  - Tablature now fills the display box more effectively
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
- **Chord Diagrams**: Custom text-based ASCII rendering
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
