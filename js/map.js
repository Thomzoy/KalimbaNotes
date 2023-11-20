import 'https://unpkg.com/leaflet';

const PARIS_LATLNG = [48.866667, 2.333333];
const ZOOM_LEVEL = 10;
const RADIUS = 700;

let map;
let currentPos = {};

const MATHIS_ICON = L.icon({
    iconUrl: './assets/mathis_icon.png',
    iconSize: [50, 50], // Size of the icon
});

export function getMap() {
    return map; // Export a function to get the map object
}

export function initializeMap() {
    // Create a map
    map = L.map('map')

    // Center it on Paris
    //map = map.setView(PARIS_LATLNG, ZOOM_LEVEL);

    // Center it on local position
    map.locate({setView: true, maxZoom: ZOOM_LEVEL});

    // Add a tile layer to the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
}

export function onLocationFound(e) {
    var radius = RADIUS; // Or use e.accuracy;

    currentPos.marker = L.marker(e.latlng, { icon: MATHIS_ICON })
    currentPos.marker.addTo(map)

    currentPos.circle = L.circle(e.latlng, radius);
    currentPos.circle.addTo(map);
}
