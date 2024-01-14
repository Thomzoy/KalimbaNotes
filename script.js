function preventDefault(e){
    e.preventDefault();
}

function disableScroll(){
    document.body.addEventListener('touchmove', preventDefault, { passive: false });
}
function enableScroll(){
    document.body.removeEventListener('touchmove', preventDefault);
}

//disableScroll()

const IndexToNoteTable = [0, 0, 0, 0, 1, 1, 1, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 10, 10, 11, 11, 11, 11, 11, 12, 12, 12, 12, 13, 13, 13, 13, 13, 14, 14, 14, 14, 14, 14, 15, 15, 15, 15, 15, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 22, 22, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37]
const DELAY = 50 / 4 // Approx. 500ms per 40 frames in KalimbaGo
const FMParams = {
    "harmonicity": 8,
    "modulationIndex": 2,
    "oscillator": {
              "type": "sine"
    },
    "envelope": {
              "attack": 0.001,
              "decay": 2,
              "sustain": 0.1,
              "release": 2
    },
    "modulation": {
              "type": "square"
    },
    "modulationEnvelope": {
              "attack": 0.002,
              "decay": 0.2,
              "sustain": 0,
              "release": 0.2
    }
}

function onAnimationEnd(el, synth) {

    var noteToPlay = el.parentNode.innerText;
    noteToPlay = noteToPlay.replace("°°","6")
    noteToPlay = noteToPlay.replace("°","5");
    if (noteToPlay.length === 1) {
        noteToPlay += "4";
    }

    synth.triggerAttackRelease(noteToPlay, "8n");

    el.parentNode.classList.add('rectangle-outside');

    // Set a timeout to remove the class after the specified time
    setTimeout(() => {
        //rect.classList.add('rectangle-inside');
        el.parentNode.classList.remove('rectangle-outside');
        el.remove();
    }, 500);
  }

function createNote(noteId, noteDelay, synth){

    var rect = document.getElementById(noteId)
    var element = document.createElement("div");
    element.style.width = rect.scrollWidth;
    element.classList.add("square");
    // element.setAttribute("id", Date.now());
    element.style.animationDelay = noteDelay + 'ms';
    element.style.webkitAnimationDelay = noteDelay + 'ms';

    element.style.animationDuration = "2500ms"
    element.style.webkitAnimationDuration = "2500ms"

    element.addEventListener('animationend', () => onAnimationEnd(element, synth));

    return [element, rect]
}

function getAvailableSongs(){
    const dropdown = document.getElementById('dropdown');
    fetch("songlist.json")
    .then(response => response.json())
    .then(songs => {
        for (var songName in songs) {
            const option = document.createElement('option');
            option.value = songs[songName]; // set a unique value for each option
            option.text = songName;
            dropdown.add(option);
          }
    })
       
}

function prepareSong(fileName){
    // Remove existing notes
    var elements = document.querySelectorAll('.square');
    elements.forEach(function(element) {
        element.parentNode.removeChild(element);
    });

    // Prepare synth
    
    const synth = new Tone.PolySynth(Tone.FMSynth, FMParams).toDestination();

    // Using fetch API
    fetch(`songs/${fileName}`)
    .then(response => response.json())
    .then(data => {

        // Get notes and sort by reverse time onset
        var notes = data["Notes"]
        notes.sort((a, b) => b[0] - a[0]);

        var notes_to_display = []
        
        // Iterate over each note
        notes.forEach(function(note) {
            var noteDelay = DELAY * note[0];
            var noteId = [IndexToNoteTable[332-note[1]]][0];
            notes_to_display.push(
                createNote(noteId, noteDelay, synth)
            )
        });

        notes_to_display.forEach(function(noteAndParent) {
            noteAndParent[1].appendChild(noteAndParent[0])
        })
    })
    .catch(error => {
        console.error('Error reading JSON file:', error);
    });
}

getAvailableSongs();

dropdown.addEventListener('change', function() {
    const selectedOption = dropdown.options[dropdown.selectedIndex].value;
    prepareSong(selectedOption);
    //play a middle 'C' for the duration of an 8th note
});


dropdown.addEventListener('click', async () => {
	await Tone.start()
})
