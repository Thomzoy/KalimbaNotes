// file2.js
import 'https://unpkg.com/leaflet';
import { initializeMap, onLocationFound, getMap, registerOnLongPress } from './map.js';
import { itineraryOne } from './itinerary.js';

// Setup and display the map
initializeMap();

var map = getMap(); 

// Add position and circle
map.on('locationfound', onLocationFound); 

function onLocationError(e) {
    alert(e.message);
}

map.on('locationerror', onLocationError);

// Add nearby markers activation

// Add option to move current position on long press
registerOnLongPress()

// Add first itinerary markers
itineraryOne();
  