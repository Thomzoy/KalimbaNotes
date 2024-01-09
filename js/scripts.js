const noteContainer = document.getElementById('note-container');

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getNotePosition() {
	document.querySelectorAll('.note').forEach(function(selected_note) {
  	console.log("la");
    console.log(selected_note.getBoundingClientRect().bottom);
    console.log(selected_note.parentNode.offsetHeight)
  })
}

function createNote() {
	  console.log("Creating note");
    const note = document.createElement('div');
    note.className = 'note';
    note.textContent = '♪'; // You can customize the note symbol
    note.style.left = `${Math.random() * window.innerWidth}px`; // Random horizontal position
    note.style.color = getRandomColor(); // Set random color
    noteContainer.appendChild(note);

    // Animation
    const animation = note.animate(
        [{ transform: 'translateY(0)' }, { transform: `translateY(${window.innerHeight}px)` }],
        { duration: 2000, easing: 'linear' }
    );

    animation.onfinish = () => {
        note.remove();
    };

    // Pause animation when the note reaches the bottom
/*     animation.currentTime = animation.effect.getTiming().duration / 2;
    animation.pause(); */
}

// Create falling notes at an interval (adjust the timing as needed)
//setInterval(createNote, 1000);
createNote();
setInterval(getNotePosition,100);

