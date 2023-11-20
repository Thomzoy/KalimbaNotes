import 'https://unpkg.com/leaflet';

import { MarkerManager } from './markers.js'

function itineraryOne(){
    var markerManager = new MarkerManager();

    markerManager.addMarker({
        latlng : [48.853, 2.35],
        title : "Notre-Dame",
        color : "lightgray",
        marker_type : "inactive",
        mp3: "./assets/audio/notre_dame.mp3"
    })
    
    markerManager.addMarker({
        latlng : [48.858093, 2.294694],
        title : "Tour Eiffel",
        color : "lightgray",
        marker_type : "inactive",
        mp3: "./assets/audio/tour_eiffel.mp3",
    })
}

export {itineraryOne}