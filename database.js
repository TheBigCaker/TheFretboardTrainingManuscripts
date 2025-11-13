// Part II: Definitive Instrument Tuning Database
// This will be expanded with MIDI values and more instruments as per the blueprint.
export const TUNINGS = {
    'guitar_6': {
        name: '6-String Guitar (EADGBe)',
        tuning: [
            { string: 1, note_index: 4, octave: 4, thickness: 1, open_note: "E4", label: "e" },
            { string: 2, note_index: 11, octave: 3, thickness: 2, open_note: "B3", label: "B" },
            { string: 3, note_index: 7, octave: 3, thickness: 3, open_note: "G3", label: "G" },
            { string: 4, note_index: 2, octave: 3, thickness: 4, open_note: "D3", label: "D" },
            { string: 5, note_index: 9, octave: 2, thickness: 5, open_note: "A2", label: "A" },
            { string: 6, note_index: 4, octave: 2, thickness: 6, open_note: "E2", label: "E" }
        ]
    },
    'guitar_7': {
        name: '7-String Guitar (BEADGBe)',
        tuning: [
            { string: 1, note_index: 4, octave: 4, thickness: 1, open_note: "E4", label: "e" },
            { string: 2, note_index: 11, octave: 3, thickness: 2, open_note: "B3", label: "B" },
            { string: 3, note_index: 7, octave: 3, thickness: 3, open_note: "G3", label: "G" },
            { string: 4, note_index: 2, octave: 3, thickness: 4, open_note: "D3", label: "D" },
            { string: 5, note_index: 9, octave: 2, thickness: 5, open_note: "A2", label: "A" },
            { string: 6, note_index: 4, octave: 2, thickness: 6, open_note: "E2", label: "E" },
            { string: 7, note_index: 11, octave: 1, thickness: 7, open_note: "B1", label: "B" }
        ]
    },
    'bass_4': {
        name: '4-String Bass (EADG)',
        tuning: [
            { string: 1, note_index: 7, octave: 3, thickness: 4, open_note: "G3", label: "G" },
            { string: 2, note_index: 2, octave: 3, thickness: 5, open_note: "D3", label: "D" },
            { string: 3, note_index: 9, octave: 2, thickness: 6, open_note: "A2", label: "A" },
            { string: 4, note_index: 4, octave: 2, thickness: 7, open_note: "E2", label: "E" }
        ]
    },
    'bass_5': {
        name: '5-String Bass (BEADG)',
        tuning: [
            { string: 1, note_index: 7, octave: 3, thickness: 3, open_note: "G3", label: "G" },
            { string: 2, note_index: 2, octave: 3, thickness: 4, open_note: "D3", label: "D" },
            { string: 3, note_index: 9, octave: 2, thickness: 5, open_note: "A2", label: "A" },
            { string: 4, note_index: 4, octave: 2, thickness: 6, open_note: "E2", label: "E" },
            { string: 5, note_index: 11, octave: 1, thickness: 7, open_note: "B1", label: "B" }
        ]
    },
    'mandolin': {
        name: 'Mandolin (GDAE)',
        tuning: [
            { string: 1, note_index: 4, octave: 5, thickness: 1, open_note: "E5", label: "E" },
            { string: 2, note_index: 9, octave: 4, thickness: 2, open_note: "A4", label: "A" },
            { string: 3, note_index: 2, octave: 4, thickness: 3, open_note: "D4", label: "D" },
            { string: 4, note_index: 7, octave: 3, thickness: 4, open_note: "G3", label: "G" }
        ]
    },
    'banjo_5': {
        name: '5-String Banjo (gDGBd)',
        tuning: [
            { string: 5, note_index: 7, octave: 4, thickness: 1, open_note: "G4", label: "g" }, // Drone string (High G)
            { string: 1, note_index: 2, octave: 4, thickness: 2, open_note: "D4", label: "d" },
            { string: 2, note_index: 11, octave: 3, thickness: 3, open_note: "B3", label: "B" },
            { string: 3, note_index: 7, octave: 3, thickness: 4, open_note: "G3", label: "G" },
            { string: 4, note_index: 2, octave: 3, thickness: 5, open_note: "D3", label: "D" }
        ]
    }
};

// Part III: Comprehensive Scale and Mode Library
// This will be used to populate the UI and query Tonal.js
export const SCALES = {
    'Common': [
        { name: 'Major', intervals: [0, 2, 4, 5, 7, 9, 11] },
        { name: 'Natural Minor', intervals: [0, 2, 3, 5, 7, 8, 10] },
        { name: 'Major Pentatonic', intervals: [0, 2, 4, 7, 9] },
        { name: 'Minor Pentatonic', intervals: [0, 3, 5, 7, 10] },
        { name: 'Blues', intervals: [0, 3, 5, 6, 7, 10] }
    ],
    'Modes': [
        { name: 'Ionian (Major)', intervals: [0, 2, 4, 5, 7, 9, 11] },
        { name: 'Dorian', intervals: [0, 2, 3, 5, 7, 9, 10] },
        { name: 'Phrygian', intervals: [0, 1, 3, 5, 7, 8, 10] },
        { name: 'Lydian', intervals: [0, 2, 4, 6, 7, 9, 11] },
        { name: 'Mixolydian', intervals: [0, 2, 4, 5, 7, 9, 10] },
        { name: 'Aeolian (Minor)', intervals: [0, 2, 3, 5, 7, 8, 10] },
        { name: 'Locrian', intervals: [0, 1, 3, 5, 6, 8, 10] }
    ],
    'Minor': [
        { name: 'Harmonic Minor', intervals: [0, 2, 3, 5, 7, 8, 11] },
        { name: 'Melodic Minor', intervals: [0, 2, 3, 5, 7, 9, 11] }
    ],
    'Exotic & Unique': [
        { name: 'Phrygian Dominant', intervals: [0, 1, 4, 5, 7, 8, 10] },
        { name: 'Byzantine', intervals: [0, 1, 4, 5, 7, 8, 11] },
        { name: 'Romanian Minor', intervals: [0, 2, 3, 6, 7, 9, 10] },
        { name: 'Hungarian Gypsy', intervals: [0, 2, 3, 6, 7, 8, 11] },
        { name: 'Whole Tone', intervals: [0, 2, 4, 6, 8, 10] },
        { name: 'Diminished (W-H)', intervals: [0, 2, 3, 5, 6, 8, 9, 11] },
        { name: 'Diminished (H-W)', intervals: [0, 1, 3, 4, 6, 7, 9, 10] },
        { name: 'Lydian Augmented', intervals: [0, 2, 4, 6, 8, 9, 11] },
        { name: 'Altered Scale', intervals: [0, 1, 3, 4, 6, 8, 10] },
        { name: 'Arabian', intervals: [0, 2, 4, 5, 6, 8, 10] },
        { name: 'Persian', intervals: [0, 1, 4, 5, 6, 8, 11] },
        { name: 'Oriental', intervals: [0, 1, 4, 5, 6, 9, 10] },
        { name: 'Prometheus', intervals: [0, 2, 4, 6, 9, 10] },
        { name: 'Hiraj?shi', intervals: [0, 2, 3, 7, 8] },
        { name: 'Neapolitan Major', intervals: [0, 1, 3, 5, 7, 9, 11] }
    ]
};

// Part IV: Chord Shape Library (for Chord Diagram Display)
export const CHORD_SHAPES = {
    // To be populated from chord_shapes.json
};
