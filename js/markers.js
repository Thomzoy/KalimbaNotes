import 'https://unpkg.com/leaflet';
import { getMap, getCurrentPos } from './map.js';

const ICON_SIZE = 30;

class MarkerManager {
    constructor({add_markers_at_init}) {
        this.map = getMap();
        this.markers = [];
        this.add_markers_at_init = add_markers_at_init;
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
        marker.displayed = false;

        // add click event
        marker.on('click', function() {

            var audio = document.getElementById('audioPlayer');
            if ((!audio.paused) && (audio.src.split('/').pop() == marker.mp3.split('/').pop())){
                // We check if we are on the same marker
                audio.pause();
                audio.currentTime = 0; // Reset audio to the beginning
            }
            else {
                if (marker.marker_type == "active"){
                    audio.src = marker.mp3;
                    if (audio.paused) {
                        audio.play();
                    }
                }
            }
          });

        // add to map 
        if ((this.markers.length == 0) || (this.add_markers_at_init)){
            // First marker OR any marker but should be shown anyway
            marker.displayed = true;
            marker.addTo(this.map);
        }

        // add to markers list
        this.markers.push(marker);

        return marker;
    }

    updateMarker({marker, marker_type = null}) {
        if ((marker_type == "active") && (marker.marker_type != "active"))  {
            // Check if previous markers were seen
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

            // If next marker exists and isn't displayed, do it:
            if ((marker.idx < this.markers.length) && !(this.markers[marker.idx].displayed)){
                this.markers[marker.idx].addTo(this.map)
            }
        }
        if ((marker_type == "inactive") && (marker.marker_type != "inactive")){
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