// ========== CSV-BASED TAB GENERATOR ==========
// Parses C_Major_Guitar_Training_Tablature.csv and transposes to any instrument/key
// Preserves the exact pedagogical sequence from the original template

const CHROMATIC = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Guitar standard tuning (the source instrument in the CSV)
const GUITAR_TUNING = ['E4', 'B3', 'G3', 'D3', 'A2', 'E2'];

// Convert flat notes to their sharp equivalents
function flatToSharp(note) {
    const flatToSharpMap = {
        'CB': 'B', 'DB': 'C#', 'EB': 'D#', 'FB': 'E',
        'GB': 'F#', 'AB': 'G#', 'BB': 'A#'
    };
    
    if (!note || typeof note !== 'string') return note;
    
    // Normalize symbols first
    const cleaned = note.replace('♯', '#').replace('♭', 'b').toUpperCase();
    
    // Handle note with octave (e.g., "BB3" -> "A#3")
    const matchWithOctave = cleaned.match(/^([A-G]B?)(\d+)$/);
    if (matchWithOctave) {
        const notePart = matchWithOctave[1];
        const octave = matchWithOctave[2];
        const sharp = flatToSharpMap[notePart];
        return sharp ? `${sharp}${octave}` : cleaned;
    }
    
    // Handle note without octave (e.g., "BB" -> "A#")
    const matchNoOctave = cleaned.match(/^([A-G]B?)$/);
    if (matchNoOctave) {
        const notePart = matchNoOctave[1];
        const sharp = flatToSharpMap[notePart];
        return sharp || cleaned;
    }
    
    return cleaned;
}

// Helper: Normalize note names
function normalizeNote(note) {
    if (!note || typeof note !== 'string') return '';
    return flatToSharp(note);
}

// Helper: Parse note name to get pitch class and octave
function parseNoteName(noteName) {
    const normalized = normalizeNote(noteName);
    const match = normalized.match(/^([A-G]#?)(\d+)$/);
    if (!match) return null;
    return { pitchClass: match[1], octave: parseInt(match[2]) };
}

// Helper: Convert note name to MIDI number
function noteToMidi(noteName) {
    const parsed = parseNoteName(noteName);
    if (!parsed) return null;
    
    const noteIndex = CHROMATIC.indexOf(parsed.pitchClass);
    if (noteIndex === -1) return null;
    
    return (parsed.octave + 1) * 12 + noteIndex;
}

// Helper: Convert MIDI to note name
function midiToNoteName(midi) {
    const octave = Math.floor(midi / 12) - 1;
    const noteIndex = midi % 12;
    return CHROMATIC[noteIndex] + octave;
}

// Helper: Get semitone interval between two pitch classes
function getSemitoneInterval(fromNote, toNote) {
    const fromIndex = CHROMATIC.indexOf(normalizeNote(fromNote));
    const toIndex = CHROMATIC.indexOf(normalizeNote(toNote));
    
    if (fromIndex === -1 || toIndex === -1) return 0;
    
    let interval = toIndex - fromIndex;
    if (interval < 0) interval += 12;
    return interval;
}

// Parse CSV text and extract universal note sequence
function parseCSVToNoteSequence(csvText) {
    const lines = csvText.split('\n').map(line => line.trim()).filter(line => line);
    const noteSequence = [];
    
    let currentBeat = 1;
    let firstParse = true;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const cells = line.split(',').map(cell => cell.trim());
        
        // Check if this is a "Strings\Beats>" header row
        if (cells[0] && (cells[0].includes('Strings') || cells[0].includes('Beat'))) {
            // Next 6 rows are the string data
            const stringRows = [];
            for (let j = 1; j <= 6 && (i + j) < lines.length; j++) {
                const stringLine = lines[i + j];
                const stringCells = stringLine.split(',').map(cell => cell.trim());
                
                // First cell is the string name
                const stringName = stringCells[0];
                if (stringName && (stringName.includes('e4') || stringName.includes('B3') || 
                                   stringName.includes('G3') || stringName.includes('D3') || 
                                   stringName.includes('A2') || stringName.includes('E2'))) {
                    stringRows.push({
                        stringName: normalizeNote(stringName),
                        frets: stringCells.slice(1)
                    });
                }
            }
            
            
            // Process this measure's beats
            if (stringRows.length > 0) {
                const beatsInMeasure = Math.max(...stringRows.map(r => r.frets.length));
                
                for (let beatIdx = 0; beatIdx < beatsInMeasure; beatIdx++) {
                    // Check each string for a fret at this beat
                    for (let stringIdx = 0; stringIdx < stringRows.length; stringIdx++) {
                        const fret = stringRows[stringIdx].frets[beatIdx];
                        
                        if (fret && fret !== '' && !isNaN(fret)) {
                            // Convert fret position to note name
                            const stringName = GUITAR_TUNING[stringIdx];
                            const stringMidi = noteToMidi(stringName);
                            const noteMidi = stringMidi + parseInt(fret);
                            const noteName = midiToNoteName(noteMidi);
                            
                            noteSequence.push({
                                beat: currentBeat + beatIdx,
                                note: noteName,
                                stringIndex: stringIdx,
                                originalFret: parseInt(fret)
                            });
                        }
                    }
                }
                
                currentBeat += beatsInMeasure;
            }
            
            // Skip past the string rows we just processed
            i += 6;
        }
    }
    
    return noteSequence;
}

// Transpose note sequence to a new key
function transposeNoteSequence(noteSequence, fromKey, toKey) {
    const interval = getSemitoneInterval(fromKey, toKey);
    
    if (interval === 0) {
        return noteSequence; // No transposition needed
    }
    
    return noteSequence.map(item => {
        const midi = noteToMidi(item.note);
        const transposedMidi = midi + interval;
        const transposedNote = midiToNoteName(transposedMidi);
        
        return {
            ...item,
            note: transposedNote
        };
    });
}

// Helper: Extract note name from tuning entry (handles both strings and objects)
function extractNoteName(tuningEntry) {
    if (typeof tuningEntry === 'string') {
        return tuningEntry;
    } else if (tuningEntry && tuningEntry.open_note) {
        return tuningEntry.open_note;
    } else if (tuningEntry && tuningEntry.label !== undefined && tuningEntry.octave !== undefined) {
        // Construct note name from label + octave (normalization happens later in noteToMidi)
        return `${tuningEntry.label}${tuningEntry.octave}`;
    }
    return null;
}

// Find a note on a specific instrument string
function findNoteOnString(targetNoteName, stringOpenNote, maxFret = 24) {
    // Extract note name if tuningEntry is an object
    const stringNote = extractNoteName(stringOpenNote);
    if (!stringNote) return null;
    
    const targetMidi = noteToMidi(targetNoteName);
    const stringMidi = noteToMidi(stringNote);
    
    if (targetMidi === null || stringMidi === null) return null;
    
    const fret = targetMidi - stringMidi;
    
    if (fret >= 0 && fret <= maxFret) {
        return fret;
    }
    
    return null;
}

// Map note sequence to target instrument
function mapNoteSequenceToInstrument(noteSequence, instrumentTuning, maxFret = 15) {
    const mappedSequence = [];
    const unmappableNotes = [];
    
    for (const item of noteSequence) {
        let mapped = false;
        
        // Try to find the note on the same string index first (preserves hand position)
        if (item.stringIndex < instrumentTuning.length) {
            const stringOpenNote = instrumentTuning[item.stringIndex];
            const fret = findNoteOnString(item.note, stringOpenNote, maxFret);
            
            if (fret !== null) {
                mappedSequence.push({
                    beat: item.beat,
                    stringIndex: item.stringIndex,
                    fret: fret
                });
                mapped = true;
            }
        }
        
        // If not found, search all strings
        if (!mapped) {
            for (let stringIdx = 0; stringIdx < instrumentTuning.length; stringIdx++) {
                const stringOpenNote = instrumentTuning[stringIdx];
                const fret = findNoteOnString(item.note, stringOpenNote, maxFret);
                
                if (fret !== null) {
                    mappedSequence.push({
                        beat: item.beat,
                        stringIndex: stringIdx,
                        fret: fret
                    });
                    mapped = true;
                    break;
                }
            }
        }
        
        if (!mapped) {
            unmappableNotes.push(item);
        }
    }
    
    return { mappedSequence, unmappableNotes };
}

// Octave shift the entire note sequence
function octaveShiftNoteSequence(noteSequence, octaveShift) {
    return noteSequence.map(item => {
        const midi = noteToMidi(item.note);
        const shiftedMidi = midi + (octaveShift * 12);
        const shiftedNote = midiToNoteName(shiftedMidi);
        
        return {
            ...item,
            note: shiftedNote
        };
    });
}

// Convert tuning entry to renderer format using label + octave
function toRendererFormat(tuningEntry) {
    if (typeof tuningEntry === 'string') {
        return tuningEntry;
    } else if (tuningEntry && tuningEntry.label !== undefined && tuningEntry.octave !== undefined) {
        return `${tuningEntry.label}${tuningEntry.octave}`;
    } else if (tuningEntry && tuningEntry.open_note) {
        return tuningEntry.open_note;
    }
    return null;
}

// Convert mapped sequence to tablature format
function convertToTablatureFormat(mappedSequence, instrumentTuning, totalBeats = 512) {
    const numStrings = instrumentTuning.length;
    const tablature = {};
    
    // Initialize all strings with flat array (512 beats total)
    for (let i = 0; i < numStrings; i++) {
        const stringName = toRendererFormat(instrumentTuning[i]) || `string_${i}`;
        tablature[stringName] = new Array(totalBeats).fill('-');
    }
    
    // Place notes in tablature (beat is 1-indexed, but array is 0-indexed)
    for (const item of mappedSequence) {
        const beatIndex = item.beat - 1;
        
        if (beatIndex >= 0 && beatIndex < totalBeats) {
            const stringName = toRendererFormat(instrumentTuning[item.stringIndex]) || `string_${item.stringIndex}`;
            tablature[stringName][beatIndex] = item.fret.toString();
        }
    }
    
    return tablature;
}

// Main function: Generate tab from CSV for any instrument/key
export async function generateTabFromCSV(csvText, instrumentTuning, targetKey = 'C', maxFret = 15) {
    try {
        // Step 1: Parse CSV to universal note sequence
        console.log('Parsing CSV template...');
        const noteSequence = parseCSVToNoteSequence(csvText);
        console.log(`Extracted ${noteSequence.length} notes from template`);
        
        // Step 2: Transpose to target key
        console.log(`Transposing from C Major to ${targetKey}...`);
        const transposedSequence = transposeNoteSequence(noteSequence, 'C', targetKey);
        
        // Step 3: Try to map to instrument
        console.log(`Mapping to instrument with ${instrumentTuning.length} strings...`);
        let result = mapNoteSequenceToInstrument(transposedSequence, instrumentTuning, maxFret);
        
        // Step 4: If too many unmappable notes, try octave shifting
        if (result.unmappableNotes.length > noteSequence.length * 0.1) {
            console.log(`${result.unmappableNotes.length} unmappable notes, trying octave shifts...`);
            
            // Try shifting down one octave
            const shiftedDown = octaveShiftNoteSequence(transposedSequence, -1);
            const resultDown = mapNoteSequenceToInstrument(shiftedDown, instrumentTuning, maxFret);
            
            if (resultDown.unmappableNotes.length < result.unmappableNotes.length) {
                console.log('Octave shift -1 improved mapping');
                result = resultDown;
            }
            
            // Try shifting up one octave
            const shiftedUp = octaveShiftNoteSequence(transposedSequence, 1);
            const resultUp = mapNoteSequenceToInstrument(shiftedUp, instrumentTuning, maxFret);
            
            if (resultUp.unmappableNotes.length < result.unmappableNotes.length) {
                console.log('Octave shift +1 improved mapping');
                result = resultUp;
            }
        }
        
        // Step 5: Convert to tablature format
        console.log('Converting to tablature format...');
        const tablature = convertToTablatureFormat(result.mappedSequence, instrumentTuning);
        
        console.log(`Tab generation complete. ${result.unmappableNotes.length} notes could not be mapped.`);
        
        return tablature;
        
    } catch (error) {
        console.error('Error generating tab from CSV:', error);
        return null;
    }
}
