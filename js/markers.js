import 'https://unpkg.com/leaflet';
import { getMap, getCurrentPos } from './map.js';

const ICON_SIZE = 30;

class MarkerManager {
    constructor() {
        this.map = getMap();
        this.markers = [];
        setInterval(this.activateMarkersNearby.bind(this), 1000);
    }

    addMarker({latlng, color="lightgray", title = "Marker", marker_type = "inactive", mp3 = null}) {
        console.log(`Adding ${title}`);

        var icon = new L.AwesomeNumberMarkers({
            number: this.markers.length + 1, 
            markerColor: color,
        });

        var marker = L.marker(latlng, {icon: icon});
        marker.title = title;
        marker.marker_type = marker_type;
        marker.idx = this.markers.length + 1;
        marker.mp3 = mp3;

        marker.was_seen = false;

        // add click event
        marker.on('click', function() {

            var audio = document.getElementById('audioPlayer');
            if ((!audio.paused) && (audio.src.split('/').pop() == marker.mp3.split('/').pop())){
                // We check if we are on the same marker
                console.log("pausing");
                audio.pause();
                audio.currentTime = 0; // Reset audio to the beginning
            }
            else {
                if (marker.marker_type == "active"){
                    console.log("playing");
                    audio.src = marker.mp3;
                    if (audio.paused) {
                        audio.play();
                    }
                }
            }
          });

        // add to markers list
        this.markers.push(marker);

        // add to map
        marker.addTo(this.map);
        return marker;
    }

    updateMarker({marker, marker_type = null}) {
        if ((marker_type == "active") && (marker.marker_type != "active"))  {
            // Check if previous markers were seen
            console.log("case 1");
            if ((marker.idx > 1) && !(this.markers[marker.idx-2].was_seen)) {
                return
            }
            var color = "green";
            marker.marker_type = marker_type;
            var icon = new L.AwesomeNumberMarkers({
                number: marker.idx, 
                markerColor: color,
            });
            marker.setIcon(icon);

            // If not already playing, play the audio:
            marker.fireEvent('click');
            marker.was_seen = true;
        }
        if ((marker_type == "inactive") && (marker.marker_type != "inactive")){
            console.log("case 2");
            var color = (marker.was_seen) ? 'blue' : 'lightgray';
            marker.marker_type = marker_type;
            var icon = new L.AwesomeNumberMarkers({
                number: marker.idx, 
                markerColor: color,
            });
            marker.setIcon(icon);
        }
    }

    removeAllMarkers() {
        this.markers.forEach(marker => marker.remove());
        this.markers = [];
    }

    activateMarkersNearby(){
        const self = this;
        function activateMarkerNearBy(marker){
            const currentPos = getCurrentPos();
            var isWithinCircle = currentPos.circle.getBounds().contains(marker.getLatLng());
            if (isWithinCircle) {
                self.updateMarker({
                    marker,
                    marker_type : "active",
                });
            } else {
                self.updateMarker({
                    marker, 
                    marker_type : "inactive",
                });
            }
        }
        this.markers.forEach(activateMarkerNearBy);
    }

}

export { MarkerManager };