// file2.js
import 'https://unpkg.com/leaflet';
import { initializeMap, onLocationFound, getMap } from './map.js';

// Setup and display the map
initializeMap();

const map = getMap();

// Add position and circle
map.on('locationfound', onLocationFound); 
