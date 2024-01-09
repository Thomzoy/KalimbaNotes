var rect = document.getElementById("2-rect")
var element = document.createElement("div");
element.classList.add("square");
element.setAttribute("id", "my-square");

element.style.width = rect.scrollWidth;
rect.appendChild(element);
console.log("Done");

const animation = element.animate(
    [
        { transform: 'translateY(0)' },
        { transform: 'translateY(256px)' }, 
        // { transform: `translateY(${window.innerHeight}px)` }
    ],
    { duration: 2000, easing: 'linear' }
);