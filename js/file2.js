// file2.js
import 'https://unpkg.com/leaflet';
import { initializeMap, onLocationFound, getMap } from './map.js';

// Setup and display the map
initializeMap();

var map = getMap(); 

// Add position and circle
map.on('locationfound', onLocationFound); 

function onLocationError(e) {
    alert(e.message);
}

map.on('locationerror', onLocationError);
