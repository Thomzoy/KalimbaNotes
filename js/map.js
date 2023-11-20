import 'https://unpkg.com/leaflet';

const PARIS_LATLNG = [48.866667, 2.333333];
const ZOOM_LEVEL = 10;
const RADIUS = 700;
const MATHIS_ICON = L.icon({
    iconUrl: './assets/mathis_icon.png',
    iconSize: [50, 50], // Size of the icon
    // iconAnchor: [50, 25],
});

class CurrentPosition {
    // Current position of the user
    // Stores the marker + the circle around it
    constructor(icon, radius, color) {
        this.map = null;
        this.icon = icon;
        this.radius = radius;
        this.marker = null;
        this.circle = null;
        this.color = null;
    }

    setInitial(latlng) {
        this.map = getMap();
        this.marker = new L.marker(latlng, { icon: this.icon })
        this.marker.addTo(this.map)
        this.circle = L.circle(latlng, this.radius);
        this.circle.setStyle({color: this.color})
        this.circle.addTo(this.map);
    }

    updateLocation(latlng) {
        this.marker.setLatLng(latlng);
        this.circle.setLatLng(latlng);
    }
}

let map;
let currentPos = new CurrentPosition(MATHIS_ICON, RADIUS, "blue");


export function getMap() {
    return map; // Export a function to get the map object
}

export function getCurrentPos() {
    return currentPos; // Export a function to get the map object
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
    // e.accuracy is available for a potential circle diameter
    console.log("Location found");
    currentPos.setInitial(e.latlng)
}

// For debbuging: move current position where clicked

export function registerOnLongPress(){
    var longPressTimeout;
    var longPressDuration = 500; // in milliseconds
    
    map.on('mousedown', function (e) {
        longPressTimeout = setTimeout(function () {
            onLongPress(e);
        }, longPressDuration);
    });
    
    map.on('mouseup', function () {
        clearTimeout(longPressTimeout);
    });
    
    function onLongPress(e) {
        // Handle the long press event here
        console.log('Long press at', e.latlng);
        
        // Move current position
        currentPos.updateLocation(e.latlng)
    }
}
