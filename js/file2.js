// file2.js
import { sayHello } from './file1.js';

function greet() {
    const greeting = sayHello();

    // Update the DOM with the greeting
    const greetingElement = document.getElementById('greeting');
    if (greetingElement) {
        greetingElement.textContent = greeting;
    }
}

// Call the greet function
greet();
