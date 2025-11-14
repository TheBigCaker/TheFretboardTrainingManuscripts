// ========== FIX 1: KEY SYNCHRONIZATION ==========

// Global state for tab data
let manuscriptTabData = null;

// Centralized key selection function - syncs Circle of Fifths AND Root Note dropdown
function setActiveKey(key) {
    // Update Circle of Fifths button state
    document.querySelectorAll('.key-button').forEach(btn => {
        if (btn.textContent === key) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Update Root Note dropdown to match
    const rootSelect = document.getElementById('rootSelect');
    if (rootSelect) {
        // Find the option with this key value
        for (let i = 0; i < rootSelect.options.length; i++) {
            if (rootSelect.options[i].textContent === key) {
                rootSelect.selectedIndex = i;
                break;
            }
        }
    }
    
    // Update diatonic chords display
    updateDiatonicChords(key);
}

// Update diatonic chords for a key (separated from selectKey for clarity)
function updateDiatonicChords(key) {
    // Get diatonic chords using Tonal.js
    const scale = Tonal.Scale.get(`${key} major`);
    const chordNames = scale.notes.map((note, index) => {
        // Build triads: I, ii, iii, IV, V, vi, vii°
        const quality = ['', 'm', 'm', '', '', 'm', 'dim'][index];
        return note + quality;
    });
    
    // Display diatonic chords
    const chordDisplay = document.getElementById('diatonic-chords-display');
    if (chordDisplay) {
        chordDisplay.innerHTML = '';
        const romanNumerals = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];
        
        chordNames.forEach((chordName, index) => {
            const btn = document.createElement('button');
            btn.className = 'diatonic-chord-btn px-4 py-2 bg-white border-2 border-gray-300 rounded-lg font-semibold hover:border-indigo-500 hover:text-indigo-600';
            btn.innerHTML = `<span class="text-xs text-gray-500">${romanNumerals[index]}</span><br>${chordName}`;
            btn.addEventListener('click', () => displayChord(chordName, btn));
            chordDisplay.appendChild(btn);
        });
    }
    
    // Display common progressions
    displayProgressions(key, chordNames);
}

// ========== FIX 2: CHORD DIAGRAM DISPLAY ==========

// Fixed displayChord function with proper SVGuitar container setup
function displayChord_Fixed(chordName, buttonElement) {
    // Remove active class from all chord buttons
    document.querySelectorAll('.diatonic-chord-btn').forEach(btn => btn.classList.remove('active'));
    buttonElement.classList.add('active');
    
    // Get current instrument
    const instrumentSelect = document.getElementById('instrumentFilter');
    const instrumentKey = instrumentSelect ? instrumentSelect.value : 'guitar_6';
    const instrumentName = '6-String Guitar (EADGBe)'; // Default
    
    // Look up chord shape
    const shapes = chordShapesData[instrumentName];
    if (!shapes || !shapes[chordName]) {
        const container = document.getElementById('chord-display-container');
        if (container) {
            container.innerHTML = `<p class="text-gray-500 italic">Chord shape not available for ${chordName}</p>`;
        }
        return;
    }
    
    // Use first voicing
    const chordData = shapes[chordName][0];
    
    // FIX: Create a child div for SVGuitar to target
    const container = document.getElementById('chord-display-container');
    container.innerHTML = '<div id="chord-diagram"></div>';
    
    renderChordDiagram(chordData, '#chord-diagram');
}

// ========== FIX 3: CSV LOADING AND TAB RENDERING ==========

// Load and parse the CSV tablature file
async function loadTabCsv() {
    try {
        const response = await fetch('/C_Major_Guitar_Tab_sequential.csv');
        const csvText = await response.text();
        manuscriptTabData = parseCsvToTabData(csvText);
        console.log('Tab CSV loaded successfully');
        renderAllPhases();
    } catch (error) {
        console.error('Error loading tab CSV:', error);
    }
}

// Parse CSV into structured tab data
function parseCsvToTabData(csvText) {
    const lines = csvText.split('\n');
    const tabData = {
        e4: [],
        B3: [],
        G3: [],
        D3: [],
        A2: [],
        E2: []
    };
    
    let currentBeat = 0;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const cells = line.split(',');
        const rowLabel = cells[0];
        
        // Check if this is a string data row
        if (tabData.hasOwnProperty(rowLabel)) {
            // Extract fret numbers from columns 1-16 (beats 1-16 of this block)
            for (let j = 1; j <= 16 && j < cells.length; j++) {
                const fret = cells[j].trim();
                tabData[rowLabel].push(fret || '');
            }
        }
    }
    
    return tabData;
}

// Render all three phases
function renderAllPhases() {
    if (!manuscriptTabData) return;
    
    // Phase 1: Beats 1-192 (Drill)
    renderManuscriptPhase('phase1-display', 0, 192);
    
    // Phase 2: Beats 193-208 (Map)
    renderManuscriptPhase('phase2-display', 192, 208);
    
    // Phase 3: Beats 209-512 (Apply)
    renderManuscriptPhase('phase3-display', 208, 512);
}

// Render a single phase of tablature
function renderManuscriptPhase(containerId, startBeat, endBeat) {
    if (!manuscriptTabData) return;
    
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const strings = ['e4', 'B3', 'G3', 'D3', 'A2', 'E2'];
    const beatsPerMeasure = parseInt(document.getElementById('beats-per-measure')?.value || '4');
    const measuresPerBar = parseInt(document.getElementById('measures-per-bar')?.value || '4');
    const beatsPerBar = beatsPerMeasure * measuresPerBar;
    
    let html = '<div class="tab-staff">';
    
    // For each string
    strings.forEach(stringName => {
        html += `<div class="tab-staff-line">`;
        html += `<span class="text-xs font-mono text-gray-600 w-8">${stringName}</span>`;
        html += `<div class="tab-string-content">`;
        
        // Render beats
        for (let beat = startBeat; beat < endBeat && beat < manuscriptTabData[stringName].length; beat++) {
            const fret = manuscriptTabData[stringName][beat];
            const displayFret = fret || '-';
            
            // Add separator every measure
            if (beat > startBeat && (beat - startBeat) % beatsPerMeasure === 0) {
                html += '<span class="tab-separator">|</span>';
            }
            
            html += `<span class="tab-fret-cell">${displayFret}</span>`;
            
            // Line break after each bar
            if (beat > startBeat && (beat - startBeat + 1) % beatsPerBar === 0 && beat < endBeat - 1) {
                html += '</div></div>';
                html += `<div class="tab-staff-line">`;
                html += `<span class="text-xs font-mono text-gray-600 w-8">${stringName}</span>`;
                html += `<div class="tab-string-content">`;
            }
        }
        
        html += '</div></div>';
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// Playback functions
async function playManuscript() {
    if (!manuscriptTabData) {
        console.log('No tab data loaded');
        return;
    }
    
    await Tone.start();
    Tone.Transport.stop();
    Tone.Transport.cancel();
    
    const synth = new Tone.Synth().toDestination();
    const tempo = parseInt(document.getElementById('tab-tempo')?.value || '120');
    Tone.Transport.bpm.value = tempo;
    
    const strings = ['e4', 'B3', 'G3', 'D3', 'A2', 'E2'];
    const tuningMap = {
        'e4': 64, 'B3': 59, 'G3': 55, 'D3': 50, 'A2': 45, 'E2': 40
    };
    
    const playableEvents = [];
    const TIME_PER_BEAT = 0.125; // 16th note at 120 BPM
    
    strings.forEach(stringName => {
        manuscriptTabData[stringName].forEach((fret, beatIndex) => {
            if (fret && fret !== '' && fret !== '-') {
                const time = beatIndex * TIME_PER_BEAT;
                const baseMidi = tuningMap[stringName];
                const noteMidi = baseMidi + parseInt(fret, 10);
                const noteName = Tonal.Note.fromMidi(noteMidi);
                
                playableEvents.push({
                    time: time,
                    note: noteName,
                    duration: '16n'
                });
            }
        });
    });
    
    const tabPart = new Tone.Part((time, event) => {
        synth.triggerAttackRelease(event.note, event.duration, time);
    }, playableEvents);
    
    tabPart.start(0);
    Tone.Transport.start();
    
    console.log(`Playing ${playableEvents.length} notes`);
}

function stopManuscript() {
    Tone.Transport.stop();
    Tone.Transport.cancel();
    console.log('Playback stopped');
}
