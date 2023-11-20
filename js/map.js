import 'https://unpkg.com/leaflet';

const PARIS_LATLNG = [48.866667, 2.333333];
const ZOOM_LEVEL = 10;
const RADIUS = 700;

let map;

export function getMap() {
    return map; // Export a function to get the map object
}

export function initializeMap() {
    // Create a map centered at [0, 0] with zoom level 2
    map = L.map('map').setView(PARIS_LATLNG, ZOOM_LEVEL);

    // Add a tile layer to the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
}

export function onLocationFound(e) {
    console.log("onloc");
    var radius = 700; //e.accuracy;

    L.marker(e.latlng).addTo(map)
        .bindPopup("You are within " + radius + " meters from this point").openPopup();

    circle = L.circle(e.latlng, radius);
    circle.addTo(map);
}
