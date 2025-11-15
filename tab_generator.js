// ========== ALGORITHMIC TAB GENERATOR ==========
// Generates pedagogical tablature for any key/mode on any instrument
// Follows the 6-Module Pedagogical Framework

// Helper: Get chromatic note names
const CHROMATIC = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Helper: Normalize note names (handle ♯/♭ variations)
function normalizeNote(note) {
    return note.replace('♯', '#').replace('♭', 'b').replace(/[0-9]/g, '').toUpperCase();
}

// Helper: Convert note to MIDI number
function noteToMidi(noteName, octave) {
    const normalized = normalizeNote(noteName);
    const noteIndex = CHROMATIC.indexOf(normalized);
    if (noteIndex === -1) return null;
    return (octave + 1) * 12 + noteIndex;
}

// Helper: Convert MIDI to note name
function midiToNote(midi) {
    const octave = Math.floor(midi / 12) - 1;
    const noteIndex = midi % 12;
    return { note: CHROMATIC[noteIndex], octave };
}

// Helper: Find all fret positions where a note appears on a string
function findNoteOnString(targetNote, stringOpenNote, maxFret = 24) {
    const targetNormalized = normalizeNote(targetNote);
    const stringNormalized = normalizeNote(stringOpenNote);
    
    const targetIndex = CHROMATIC.indexOf(targetNormalized);
    const stringIndex = CHROMATIC.indexOf(stringNormalized);
    
    if (targetIndex === -1 || stringIndex === -1) return [];
    
    const positions = [];
    for (let fret = 0; fret <= maxFret; fret++) {
        const fretNoteIndex = (stringIndex + fret) % 12;
        if (fretNoteIndex === targetIndex) {
            positions.push(fret);
        }
    }
    return positions;
}

// Helper: Get scale notes for a given root and intervals
function getScaleNotes(rootNote, intervals) {
    const rootNormalized = normalizeNote(rootNote);
    const rootIndex = CHROMATIC.indexOf(rootNormalized);
    if (rootIndex === -1) return [];
    
    const scaleNotes = intervals.map(interval => {
        const noteIndex = (rootIndex + interval) % 12;
        return CHROMATIC[noteIndex];
    });
    
    return scaleNotes;
}

// Helper: Generate blank measure (16 beats of silence)
function blankMeasure() {
    return Array(16).fill('-');
}

// MODULE 1: Single-String Linearization (Horizontal Mastery)
// Generate 3-note sequential patterns on a single string
function generateModule1SingleString(stringOpenNote, scaleNotes, maxFret = 12) {
    const stringNormalized = normalizeNote(stringOpenNote);
    const stringIndex = CHROMATIC.indexOf(stringNormalized);
    
    // Find all scale notes available on this string
    const availableNotes = [];
    for (let fret = 0; fret <= maxFret; fret++) {
        const fretNoteIndex = (stringIndex + fret) % 12;
        const fretNote = CHROMATIC[fretNoteIndex];
        if (scaleNotes.includes(fretNote)) {
            availableNotes.push({ note: fretNote, fret });
        }
    }
    
    // Generate 3-note permutation patterns (16 beats)
    if (availableNotes.length < 3) {
        // If not enough notes, use 2-note pattern or single note
        if (availableNotes.length === 2) {
            const [n1, n2] = availableNotes;
            return [
                n1.fret, n2.fret, n1.fret, n2.fret,
                n1.fret, n2.fret, n2.fret, n1.fret,
                n2.fret, n1.fret, n2.fret, n1.fret,
                n2.fret, n1.fret, n1.fret, '-'
            ].map(v => v === '-' ? '-' : v.toString());
        } else if (availableNotes.length === 1) {
            const n1 = availableNotes[0];
            return [
                n1.fret, '-', n1.fret, '-', n1.fret, '-', '-', '-',
                n1.fret, '-', n1.fret, '-', n1.fret, '-', '-', '-'
            ].map(v => v === '-' ? '-' : v.toString());
        }
        return blankMeasure();
    }
    
    // Use first 3 available notes for pattern
    const [n1, n2, n3] = availableNotes.slice(0, 3);
    
    // Create ascending/descending 3-note pattern
    return [
        n1.fret, n2.fret, n1.fret, n3.fret,
        n2.fret, n3.fret, n2.fret, n1.fret,
        n3.fret, n1.fret, n2.fret, n1.fret,
        n3.fret, n1.fret, n3.fret, n2.fret
    ].map(v => v.toString());
}

// MODULE 2: Positional Scale Fragment (Vertical Integration)
// Generate scale fragments that move across strings in one position
// Returns array of patterns, one for each string
function generateModule2PositionalScale(allStringsOpenNotes, scaleNotes, startFret = 0) {
    const numStrings = allStringsOpenNotes.length;
    const stringPatterns = [];
    
    // Build a sequence that ascends across all strings with timeline placement
    const sequence = [];
    
    // Collect multiple scale notes from all strings in the position
    for (let i = numStrings - 1; i >= 0; i--) {
        const stringOpenNote = allStringsOpenNotes[i];
        const stringNormalized = normalizeNote(stringOpenNote);
        const stringIndex = CHROMATIC.indexOf(stringNormalized);
        
        // Find 2-3 scale notes near the start position (within 5 frets)
        const stringNotes = [];
        for (let fret = startFret; fret <= startFret + 5; fret++) {
            const fretNoteIndex = (stringIndex + fret) % 12;
            const fretNote = CHROMATIC[fretNoteIndex];
            
            if (scaleNotes.includes(fretNote)) {
                stringNotes.push({ stringIdx: i, fret });
                if (stringNotes.length >= 2) break; // Collect 2-3 notes per string
            }
        }
        
        // Add collected notes to sequence
        sequence.push(...stringNotes);
    }
    
    // Calculate beats per note (spread across 16 beats)
    const beatsPerNote = sequence.length > 0 ? Math.max(1, Math.floor(16 / sequence.length)) : 16;
    
    // Create timeline-based patterns for each string
    for (let stringIdx = 0; stringIdx < numStrings; stringIdx++) {
        const pattern = Array(16).fill('-'); // Start with all rests
        
        // Place notes on timeline for this string
        sequence.forEach((note, seqIdx) => {
            if (note.stringIdx === stringIdx) {
                const beatPosition = seqIdx * beatsPerNote;
                if (beatPosition < 16) {
                    pattern[beatPosition] = note.fret.toString();
                }
            }
        });
        
        stringPatterns.push(pattern);
    }
    
    return stringPatterns;
}

// MODULE 3: Diatonic Melodic Patterns (Musical Application)
// Generate non-linear melodic sequences using scale notes
function generateModule3MelodicPattern(stringOpenNote, scaleNotes, measureIndex = 0) {
    const availableNotes = [];
    const stringNormalized = normalizeNote(stringOpenNote);
    const stringIndex = CHROMATIC.indexOf(stringNormalized);
    
    // Find scale notes on this string (low to mid range)
    for (let fret = 0; fret <= 12; fret++) {
        const fretNoteIndex = (stringIndex + fret) % 12;
        const fretNote = CHROMATIC[fretNoteIndex];
        if (scaleNotes.includes(fretNote)) {
            availableNotes.push(fret);
        }
    }
    
    if (availableNotes.length < 3) {
        return blankMeasure();
    }
    
    // Vary the starting offset based on measure index
    const offset = measureIndex % availableNotes.length;
    
    // Create a melodic sequence with skips and returns
    const pattern = [];
    for (let i = 0; i < 4; i++) {
        const idx = (i + offset) % availableNotes.length;
        const nextIdx = (i + offset + 2) % availableNotes.length;
        pattern.push(
            availableNotes[idx].toString(),
            '-',
            availableNotes[nextIdx].toString(),
            '-'
        );
    }
    
    return pattern.slice(0, 16);
}

// MODULE 4: Harmonic Context (Chord Arpeggios)
// Generate arpeggio patterns using chord tones (C, E, G for C major)
function generateModule4ChordArpeggio(stringOpenNote, chordTones = ['C', 'E', 'G'], measureIndex = 0) {
    const availableChordTones = [];
    
    // Find chord tones on this string with multiple positions
    for (const tone of chordTones) {
        const positions = findNoteOnString(tone, stringOpenNote, 12);
        positions.forEach(pos => {
            availableChordTones.push({
                note: tone,
                fret: pos
            });
        });
    }
    
    if (availableChordTones.length === 0) {
        return blankMeasure();
    }
    
    // Alternate between ascending and descending based on measure
    const ascending = measureIndex % 2 === 0;
    
    // Create arpeggio pattern
    const pattern = [];
    const tones = ascending ? availableChordTones : [...availableChordTones].reverse();
    
    tones.forEach(ct => {
        pattern.push(ct.fret.toString(), '-');
    });
    
    // Fill remaining beats
    while (pattern.length < 16) {
        pattern.push('-');
    }
    
    return pattern.slice(0, 16);
}

// MODULE 5: Multi-Octave Scale Traversal (Fretboard Unification)
// Generate full-range scale runs across the neck
function generateModule5Traversal(stringOpenNote, scaleNotes, measureIndex = 0) {
    const availableNotes = [];
    const stringNormalized = normalizeNote(stringOpenNote);
    const stringIndex = CHROMATIC.indexOf(stringNormalized);
    
    // Find ALL scale notes on this string (extended range)
    for (let fret = 0; fret <= 15; fret++) {
        const fretNoteIndex = (stringIndex + fret) % 12;
        const fretNote = CHROMATIC[fretNoteIndex];
        if (scaleNotes.includes(fretNote)) {
            availableNotes.push(fret);
        }
    }
    
    if (availableNotes.length < 2) {
        return blankMeasure();
    }
    
    // Use local measure index (0-3 for M27-M30) to cycle through distinct slices
    const localMeasure = measureIndex >= 26 ? (measureIndex - 26) : measureIndex;
    
    // Choose different slice of notes based on local measure to create variety
    const sliceSize = Math.min(6, availableNotes.length);
    const maxStartIdx = Math.max(1, availableNotes.length - sliceSize + 1);
    const startIdx = localMeasure % maxStartIdx;
    const notesSlice = availableNotes.slice(startIdx, startIdx + sliceSize);
    
    // Alternate between ascending and descending
    const ascending = localMeasure % 2 === 0;
    const pattern = [];
    
    const sequence = ascending ? notesSlice : [...notesSlice].reverse();
    sequence.forEach(fret => {
        pattern.push(fret.toString());
    });
    
    // Fill or trim to 16 beats
    while (pattern.length < 16) {
        pattern.push('-');
    }
    
    return pattern.slice(0, 16);
}

// MODULE 6: Capstone Virtuosity (Advanced Runs)
// Generate rapid position-shifting melodic runs
function generateModule6Virtuoso(stringOpenNote, scaleNotes, measureIndex = 0) {
    const availableNotes = [];
    const stringNormalized = normalizeNote(stringOpenNote);
    const stringIndex = CHROMATIC.indexOf(stringNormalized);
    
    // Find scale notes with wider range
    for (let fret = 0; fret <= 12; fret++) {
        const fretNoteIndex = (stringIndex + fret) % 12;
        const fretNote = CHROMATIC[fretNoteIndex];
        if (scaleNotes.includes(fretNote)) {
            availableNotes.push(fret);
        }
    }
    
    if (availableNotes.length < 3) {
        return blankMeasure();
    }
    
    // Vary pattern type based on measure index
    const patternType = measureIndex % 3;
    const pattern = [];
    
    if (patternType === 0) {
        // Ascending with rhythmic gaps
        for (let i = 0; i < availableNotes.length && pattern.length < 14; i++) {
            pattern.push(availableNotes[i].toString());
            if (i % 2 === 0) {
                pattern.push('-');
            }
        }
    } else if (patternType === 1) {
        // Descending rapid run
        for (let i = availableNotes.length - 1; i >= 0 && pattern.length < 14; i--) {
            pattern.push(availableNotes[i].toString());
        }
    } else {
        // Skip pattern (every other note)
        for (let i = 0; i < availableNotes.length && pattern.length < 14; i += 2) {
            pattern.push(availableNotes[i].toString(), '-');
        }
    }
    
    // Fill to 16
    while (pattern.length < 16) {
        pattern.push('-');
    }
    
    return pattern.slice(0, 16);
}

// MAIN GENERATOR: Create complete 512-beat pedagogical tab
export function generatePedagogicalTab(instrumentTuning, rootNote, scaleIntervals) {
    // Get scale notes
    const scaleNotes = getScaleNotes(rootNote, scaleIntervals);
    
    // Get strings (reversed for display: thinnest to thickest)
    const strings = instrumentTuning.tuning.map(s => `${s.label}${s.octave}`).reverse();
    const stringOpenNotes = instrumentTuning.tuning.map(s => s.open_note).reverse();
    const numStrings = strings.length;
    
    // Pre-generate Module 2 data (vertical scale fragments across all strings)
    const module2Data = {};
    for (let m = 6; m < 10; m++) {
        const startFret = (m - 6) * 3;
        const fragment = generateModule2PositionalScale(stringOpenNotes, scaleNotes, startFret);
        module2Data[m] = fragment;
    }
    
    const tab = {};
    
    // Generate tab for each string
    strings.forEach((stringKey, idx) => {
        const stringOpenNote = stringOpenNotes[idx];
        const stringIdx = numStrings - 1 - idx;
        const measures = [];
        
        // 32 measures total, each module gets specific measures
        for (let m = 0; m < 32; m++) {
            let pattern;
            
            // MODULE 1: M1-M6 (Single-String Linearization - rotation system)
            if (m < 6) {
                const activeString = m % numStrings;
                if (activeString === stringIdx) {
                    pattern = generateModule1SingleString(stringOpenNote, scaleNotes);
                } else {
                    pattern = blankMeasure();
                }
            }
            // MODULE 2: M7-M10 (Positional Scale Fragments - vertical integration)
            else if (m < 10) {
                // Use pre-generated cross-string fragment for this string
                pattern = module2Data[m][idx] || blankMeasure();
            }
            // MODULE 3: M11-M16 (Melodic Patterns)
            else if (m < 16) {
                pattern = generateModule3MelodicPattern(stringOpenNote, scaleNotes, m);
            }
            // MODULE 4: M17-M26 (Harmonic Context - using scale's I chord tones)
            else if (m < 26) {
                // Use root, third, and fifth of the scale
                const chordTones = [
                    scaleNotes[0], // Root (I)
                    scaleNotes[2], // Third
                    scaleNotes[4]  // Fifth
                ];
                pattern = generateModule4ChordArpeggio(stringOpenNote, chordTones, m);
            }
            // MODULE 5: M27-M30 (Multi-Octave Traversal - ALL strings participate)
            else if (m < 30) {
                pattern = generateModule5Traversal(stringOpenNote, scaleNotes, m);
            }
            // MODULE 6: M31-M32 (Capstone Virtuosity - ALL strings participate)
            else {
                pattern = generateModule6Virtuoso(stringOpenNote, scaleNotes, m);
            }
            
            measures.push(...pattern);
        }
        
        tab[stringKey] = measures;
    });
    
    return tab;
}

// Export for use in main.js
if (typeof window !== 'undefined') {
    window.generatePedagogicalTab = generatePedagogicalTab;
}
