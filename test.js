function preventDefault(e){
    e.preventDefault();
}

function disableScroll(){
    document.body.addEventListener('touchmove', preventDefault, { passive: false });
}
function enableScroll(){
    document.body.removeEventListener('touchmove', preventDefault);
}

disableScroll()

const IndexToNoteTable = [0, 0, 0, 0, 1, 1, 1, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 10, 10, 11, 11, 11, 11, 11, 12, 12, 12, 12, 13, 13, 13, 13, 13, 14, 14, 14, 14, 14, 14, 15, 15, 15, 15, 15, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 22, 22, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37]
const DELAY = 50 / 2 // Approx. 500ms per 40 frames in KalimbaGo

function createNote(noteId, noteDelay){

    var rect = document.getElementById(noteId)
    var element = document.createElement("div");
    element.style.width = rect.scrollWidth;
    element.classList.add("square");
    element.setAttribute("id", "my-square");
    element.style.animationDelay = noteDelay + 'ms';
    element.style.webkitAnimationDelay = noteDelay + 'ms';

    return [element, rect]
}

function getAvailableSongs(){
    var Songs = []
    const dropdown = document.getElementById('dropdown');
    fetch("./songs")
        .then(response => response.text())
        .then(data => {
            // Parse the HTML content to extract image filenames
            const parser = new DOMParser();
            const htmlDocument = parser.parseFromString(data, 'text/html');
            const Files = Array.from(htmlDocument.querySelectorAll('a'))
                .map(link => link.getAttribute('href'))
                .filter(href => /\.(json)$/i.test(href));

            // Display the image filenames
            Files.forEach(filename => {
                const option = document.createElement('option');
                option.value = filename.toLowerCase().replace(' ', '_'); // set a unique value for each option
                option.text = filename;
                dropdown.add(option);
            });
        })
        .catch(error => console.error('Error fetching image list:', error));
       
}

function prepareSong(fileName){

    // Remove existing notes
    var elements = document.querySelectorAll('.square');
    elements.forEach(function(element) {
        element.parentNode.removeChild(element);
    });

    // Using fetch API
    fetch(`songs/${fileName}`)
    .then(response => response.json())
    .then(data => {

        // Get notes and sort by time onset
        var notes = data["Notes"]
        notes.sort((a, b) => a[0] - b[0]);

        var notes_to_display = []
        
        // Iterate over each note
        notes.forEach(function(note) {
            var noteDelay = DELAY * note[0];
            var noteId = [IndexToNoteTable[332-note[1]]][0];
            notes_to_display.push(
                createNote(noteId, noteDelay)
            )
        });

        notes_to_display.forEach(function(noteAndParent) {
            noteAndParent[1].appendChild(noteAndParent[0])
        })
        console.log(notes_to_display)
    })
    .catch(error => {
        console.error('Error reading JSON file:', error);
    });
}

getAvailableSongs();

dropdown.addEventListener('change', function() {
    // Callback function to be executed when an option is selected
    const selectedOption = dropdown.options[dropdown.selectedIndex].text;
    prepareSong(selectedOption);
    console.log(`Selected option: ${selectedOption}`);
    // Add your custom logic here
});

