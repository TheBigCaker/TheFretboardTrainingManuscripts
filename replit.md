# The Fretboard Training Manuscripts

## Overview
This project is an interactive web application designed to help guitarists, bassists, and other stringed instrument players visualize scales and modes, learn chord progressions, practice with generated tablature sequences, and understand music theory fundamentals. The business vision is to provide a comprehensive, intuitive, and accessible tool that enhances musical learning and practice for stringed instrument players, potentially expanding into a widely used educational platform.

## User Preferences
I prefer a minimalist design with a focus on clear, functional elements. The visual aesthetic should be clean and monochrome, prioritizing readability and precise typography. I value direct feedback and immediate visual updates when I make selections. I also prefer to keep the `public/` directory for static assets and the core application logic in `main.js`. I want the agent to use a "practice-first" approach, meaning that practice materials should be prioritized in the layout. Do not make changes to the file `vite.config.js`.

## System Architecture
The application is a fully functional frontend built with Vite and vanilla JavaScript. It uses external CDN libraries for music theory (Tonal.js) and audio synthesis (Tone.js). Chord diagrams are rendered using a custom text-based ASCII system for enhanced reliability and customization. The UI/UX prioritizes a clean, minimalist design with precise monospaced typography, particularly for tablature and chord diagrams, using a monochrome styling.

**Technical Implementations & Feature Specifications:**
-   **Fretboard Visualization**: Displays scale patterns interactively, supporting multiple instruments (6/7-string guitars, 4/5-string basses, mandolin, ukulele, 5-string banjo).
-   **Extensive Scale Library**: Includes over 50 scales covering Western, Modal, Exotic, and Jazz styles.
-   **Interactive Harmony**: Automatically displays diatonic chords and common progressions based on the selected root note from the main menu. Features comprehensive chord diagrams with proper string orientation (thickest on bottom, thinnest on top).
-   **Algorithmic Tablature Training**: Fully algorithmic tab generation system (tab_generator.js) that creates comprehensive 512-beat (32-measure) pedagogical tablature sequences for ANY key and ANY instrument. Uses a 6-module pedagogical framework: Module 1 (M1-M6): Single-String Linearization with rotation system; Module 2 (M7-M10): Positional Scale Fragments with timeline-based vertical integration across strings; Module 3 (M11-M16): Diatonic Melodic Patterns; Module 4 (M17-M21): Harmonic Context with chord arpeggios using scale's I chord tones; Module 5 (M22-M26): Multi-Octave Scale Traversal; Module 6 (M27-M32): Virtuosic Capstone Runs. Completely replaced deprecated CSV-transpose approach.
-   **Dynamic Audio Playback**: Intelligent audio synthesis system that plays the actual generated tablature using Tone.js. Automatically adapts to the selected instrument's tuning, respects the user's BPM setting, and converts fret positions to accurate MIDI notes using Tonal.js. Works seamlessly across all supported instruments (guitars, basses, ukulele, mandolin, banjo) and all keys.
-   **CAGED Chord Auto-Generation**: Implements a system to auto-generate multiple major and minor chord voicings across low, mid, and high fretboard positions, merging with a comprehensive database of over 100 chord positions. Includes a fallback mechanism for complex chords.
-   **Text-Based Chord Diagrams**: Custom ASCII rendering for chord diagrams, displaying string indicators (x/o), fret position markers, and finger numbers (1-4) or dots. Diagrams are landscape oriented with strings running horizontally, properly ordered from thinnest (top) to thickest (bottom).
-   **Educational Content**: Integrated music theory explanations, including detailed sections on understanding chord diagrams and progressions.
-   **Progressive Web App (PWA)**: Full PWA implementation with service worker for offline functionality, installable on mobile devices (iOS/Android), custom app icons, and native app-like experience with standalone display mode.
-   **Layout**: The page flow is optimized for learning: Scale Menu → GUI Fretboard → Training Tablature → Strings as Rows (dedicated view) → Interactive Key & Harmony.

**System Design Choices:**
-   **Modularity**: Core logic in `main.js`, instrument tunings and scale definitions in `database.js`, chord data in `chord_shapes.json`, PWA manifest and service worker in `public/`.
-   **Performance**: Utilizes Vite for fast development and optimized production builds. Service worker caches static assets for offline access.
-   **Responsiveness**: Tablature and fretboard visualizations dynamically update with user input.
-   **Consistent Aesthetic**: Adherence to a monochrome, monospaced font aesthetic for all musical notation displays.
-   **Mobile-First PWA**: Installable on iOS/Android devices with app icons (192x192, 512x512), manifest.json for app metadata, and service worker for offline functionality and caching.

## External Dependencies
-   **Build Tool**: Vite
-   **Styling**: Tailwind CSS (CDN)
-   **Music Theory**: Tonal.js (CDN)
-   **Audio**: Tone.js (CDN)