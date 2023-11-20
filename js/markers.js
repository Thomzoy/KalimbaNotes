import 'https://unpkg.com/leaflet';
import { getMap, getCurrentPos } from './map.js';

const ICON_SIZE = 30;

class MarkerManager {
    constructor() {
        this.map = getMap();
        this.markers = [];
        setInterval(this.activateMarkersNearby.bind(this), 1000);
    }

    addMarker({latlng, icon = null, title = "Marker", marker_type = "inactive"}) {
        console.log(`Adding ${title}`);
        var marker = L.marker(latlng, {icon: icon});
        marker.title = title;
        marker.marker_type = marker_type;
        marker.idx = this.markers.length;

        // add click event
        marker.on('click', function() {
            if (marker.marker_type == "active"){
                var audio = document.getElementById('audioPlayer');
                
                if (audio.paused) {
                    audio.play();
                } else {
                    audio.pause();
                    audio.currentTime = 0; // Reset audio to the beginning
                }
            }
          });

        // add to markers list
        this.markers.push(marker);

        // add to map
        marker.addTo(this.map);
        return marker;
    }

    updateMarker({marker, icon = null, marker_type = null}) {
        if (icon) {
            marker.setIcon(icon);
        }
        if (marker_type) {
            marker.marker_type = marker_type;
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
                    icon : getCircleIcon("green"),
                    marker_type : "active",
                });
            } else {
                self.updateMarker({
                    marker,
                    icon : getCircleIcon("gray"),
                    marker_type : "inactive",
                });
            }
        }
        this.markers.forEach(activateMarkerNearBy);
    }

}

function getCircleIcon(color){
    const htmlIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="${ICON_SIZE}px" viewBox="0 0 384 512"><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" fill="${color}"/></svg>`  
    return L.divIcon({
        className: 'custom-marker',
        iconSize: [ICON_SIZE, ICON_SIZE],
        iconAnchor: [ICON_SIZE / 2, ICON_SIZE],
        html: htmlIcon,
      });
}

export { MarkerManager, getCircleIcon };