// Part II: Definitive Instrument Tuning Database
// This will be expanded with MIDI values and more instruments as per the blueprint.
export const TUNINGS = {
    'Mandolin (GDAE)': [
        { string: 1, note_index: 4, octave: 5, thickness: 1, open_note: "E5", label: "E" },
        { string: 2, note_index: 9, octave: 4, thickness: 2, open_note: "A4", label: "A" },
        { string: 3, note_index: 2, octave: 4, thickness: 3, open_note: "D4", label: "D" },
        { string: 4, note_index: 7, octave: 3, thickness: 4, open_note: "G3", label: "G" }
    ],
    '5-String Banjo (G)': [
        { string: 5, note_index: 7, octave: 4, thickness: 1, open_note: "G4", label: "G" }, // Drone string (High G)
        { string: 1, note_index: 2, octave: 4, thickness: 2, open_note: "D4", label: "D" },
        { string: 2, note_index: 11, octave: 3, thickness: 3, open_note: "B3", label: "B" },
        { string: 3, note_index: 7, octave: 3, thickness: 4, open_note: "G3", label: "G" },
        { string: 4, note_index: 2, octave: 3, thickness: 5, open_note: "D3", label: "D" }
    ],
    '4-String Bass (EADG)': [
        { string: 1, note_index: 7, octave: 3, thickness: 4, open_note: "G3", label: "G" },
        { string: 2, note_index: 2, octave: 3, thickness: 5, open_note: "D3", label: "D" },
        { string: 3, note_index: 9, octave: 2, thickness: 6, open_note: "A2", label: "A" },
        { string: 4, note_index: 4, octave: 2, thickness: 7, open_note: "E2", label: "E" }
    ],
    '5-String Bass (BEADG)': [
        { string: 1, note_index: 7, octave: 3, thickness: 3, open_note: "G3", label: "G" },
        { string: 2, note_index: 2, octave: 3, thickness: 4, open_note: "D3", label: "D" },
        { string: 3, note_index: 9, octave: 2, thickness: 5, open_note: "A2", label: "A" },
        { string: 4, note_index: 4, octave: 2, thickness: 6, open_note: "E2", label: "E" },
        { string: 5, note_index: 11, octave: 1, thickness: 7, open_note: "B1", label: "B" }
    ],
    '6-String Guitar (EADGBe)': [
        { string: 1, note_index: 4, octave: 4, thickness: 1, open_note: "E4", label: "e" },
        { string: 2, note_index: 11, octave: 3, thickness: 2, open_note: "B3", label: "B" },
        { string: 3, note_index: 7, octave: 3, thickness: 3, open_note: "G3", label: "G" },
        { string: 4, note_index: 2, octave: 3, thickness: 4, open_note: "D3", label: "D" },
        { string: 5, note_index: 9, octave: 2, thickness: 5, open_note: "A2", label: "A" },
        { string: 6, note_index: 4, octave: 2, thickness: 6, open_note: "E2", label: "E" }
    ],
    '7-String Guitar (BEADGBe)': [
        { string: 1, note_index: 4, octave: 4, thickness: 1, open_note: "E4", label: "e" },
        { string: 2, note_index: 11, octave: 3, thickness: 2, open_note: "B3", label: "B" },
        { string: 3, note_index: 7, octave: 3, thickness: 3, open_note: "G3", label: "G" },
        { string: 4, note_index: 2, octave: 3, thickness: 4, open_note: "D3", label: "D" },
        { string: 5, note_index: 9, octave: 2, thickness: 5, open_note: "A2", label: "A" },
        { string: 6, note_index: 4, octave: 2, thickness: 6, open_note: "E2", label: "E" },
        { string: 7, note_index: 11, octave: 1, thickness: 7, open_note: "B1", label: "B" }
    ]
};

// Part III: Comprehensive Scale and Mode Library
// This will be used to populate the UI and query Tonal.js
export const SCALES = {
    'Common': {
        'Major': 'major',
        'Natural Minor': 'aeolian',
        'Major Pentatonic': 'major pentatonic',
        'Minor Pentatonic': 'minor pentatonic',
        'Blues': 'blues',
    },
    'Modes': {
        'Ionian (Major)': 'ionian',
        'Dorian': 'dorian',
        'Phrygian': 'phrygian',
        'Lydian': 'lydian',
        'Mixolydian': 'mixolydian',
        'Aeolian (Minor)': 'aeolian',
        'Locrian': 'locrian',
    },
    'Minor': {
        'Harmonic Minor': 'harmonic minor',
        'Melodic Minor': 'melodic minor',
    },
    'Exotic & Unique': {
        'Phrygian Dominant': 'phrygian dominant',
        'Byzantine': 'double harmonic major',
        'Romanian Minor': 'romanian minor',
        'Hungarian Gypsy': 'hungarian minor',
        'Whole Tone': 'whole tone',
        'Diminished (W-H)': 'diminished',
        'Diminished (H-W)': 'half whole',
        'Lydian Augmented': 'lydian augmented',
        'Altered Scale': 'altered',
        'Arabian': 'arabian',
        'Persian': 'persian',
        'Oriental': 'oriental',
        'Prometheus': 'prometheus',
        'Hiraj?shi': 'hirajoshi',
        'Neapolitan Major': 'neapolitan major',
    }
};
