function preventDefault(e) {
    e.preventDefault();
}

function disableScroll() {
    document.body.addEventListener('touchmove', preventDefault, { passive: false });
}
function enableScroll() {
    document.body.removeEventListener('touchmove', preventDefault);
}

disableScroll()

const IDToNote = {
    "8": "C",
    "10": "D",
    "12": "E",
    "13": "F",
    "15": "G",
    "17": "A",
    "19": "B",
    "20": "C°",
    "22": "D°",
    "24": "E°",
    "25": "F°",
    "27": "G°",
    "29": "A°",
    "31": "C°°",
    "32": "C°°",
    "34": "B°",
    "36": "E°°"
}
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

function addOctaveValue(note) {
    var noteToPlay = note.replace("°°", "6")
    noteToPlay = noteToPlay.replace("°", "5");
    if (noteToPlay.length === 1) {
        noteToPlay += "4";
    }
    return noteToPlay
}

function createNote(noteId) {

    var rect = document.getElementById(noteId)
    var element = document.createElement("div");
    element.style.width = rect.scrollWidth;
    element.classList.add("square");

    element.style.animationDuration = "2s"
    element.style.webkitAnimationDuration = "2s"

    return [element, rect]
}

function getAvailableSongs() {
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

function populateSpeedPicker() {
    var dropdown = document.getElementById('speed-pick');

    var idx = 0;

    for (var i = -50; i <= 25; i += 5) {
      var option = document.createElement('option');
      option.value = 1 - 0.01*i;
      option.text = i + '%';
      dropdown.add(option);
      if (i === 0) {
        dropdown.selectedIndex = idx;
      };
      idx += 1;
    }
  }

function prepareSong(fileName) {
    // Remove existing notes
    var elements = document.querySelectorAll('.square');
    elements.forEach(function (element) {
        element.parentNode.removeChild(element);
    });

    Tone.Transport.stop();
    Tone.Transport.cancel(0);

    const synth = new Tone.PolySynth(
        Tone.FMSynth,
        FMParams,
    ).toDestination();

    // Prepare synth
    fetch(`songs/${fileName}`)
        .then(response => response.json())
        .then(data => {

            //synth.debug = true;

            // Get speed
            const speedRatio = document.getElementById('speed-pick').value

            // Get notes and sort by reverse time onset
            var notes = data["Notes"]
            notes.sort((a, b) => -b[0] + a[0]);

            // Iterate over each note
            notes.forEach(function (note) {
                var noteDelay = speedRatio * DELAY * note[0];
                var noteId = [IndexToNoteTable[332 - note[1]]][0];
                const noteAndParent = createNote(noteId, noteDelay)
                var rectangle = noteAndParent[1];
                var square = noteAndParent[0];

                const noteToPlay = addOctaveValue(IDToNote[noteId]);

                Tone.Transport.schedule(time => {

                    // 1. Add square
                    Tone.Draw.schedule(() => {
                        rectangle.appendChild(square);
                    }, time);

                    // 2. Play sound + change rectangle style
                    Tone.Draw.schedule(() => {
                        synth.triggerAttackRelease(
                            Tone.Frequency(noteToPlay),
                            0.1,
                        );
                        rectangle.classList.add('rectangle-outside');
                    }, time + Tone.Time(square.style.animationDuration));

                    // 3. Reset rectangle style
                    Tone.Draw.schedule(() => {
                        rectangle.classList.remove('rectangle-outside');
                        square.remove();
                    }, time + Tone.Time(square.style.animationDuration) + 0.5);

                }, noteDelay * 0.001)
            });

        })
        .catch(error => {
            console.error('Error reading JSON file:', error);
        });

    Tone.Transport.start();//"+0.5");
}

const dropdown = document.getElementById('dropdown');

dropdown.addEventListener('change', function () {
    const selectedOption = dropdown.options[dropdown.selectedIndex].value;
    prepareSong(selectedOption);
});

dropdown.addEventListener('click', async () => {
    await Tone.start()
    console.log("Audio Ready");
})

const resetButton = document.getElementById("reset-song")

resetButton.addEventListener('click', function () {
    const selectedOption = dropdown.options[dropdown.selectedIndex].value;
    prepareSong(selectedOption);
});


window.onload = function () {
    populateSpeedPicker();
    getAvailableSongs();
  };