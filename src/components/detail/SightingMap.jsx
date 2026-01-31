import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon issues in Leaflet with webpack/vite
import iconMarker from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: iconMarker,
    iconRetinaUrl: iconRetina,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function SightingMap({ coords, placeName }) {
    const mapContainer = useRef(null);
    const mapInstance = useRef(null);

    useEffect(() => {
        if (!coords || !mapContainer.current) return;

        // Initialize map if not already done
        if (!mapInstance.current) {
            mapInstance.current = L.map(mapContainer.current).setView([coords.lat, coords.lng], 6);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(mapInstance.current);

            L.marker([coords.lat, coords.lng])
                .addTo(mapInstance.current)
                .bindPopup(`<b>Sighting Location</b><br>${placeName}`)
                .openPopup();
        } else {
            // Update view if coords change
            mapInstance.current.setView([coords.lat, coords.lng], 6);

            // Clear existing markers
            mapInstance.current.eachLayer((layer) => {
                if (layer instanceof L.Marker) {
                    mapInstance.current.removeLayer(layer);
                }
            });

            L.marker([coords.lat, coords.lng])
                .addTo(mapInstance.current)
                .bindPopup(`<b>Sighting Location</b><br>${placeName}`)
                .openPopup();
        }

        // Cleanup on unmount
        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, [coords, placeName]);

    if (!coords) {
        return (
            <div className="map-placeholder error">
                <p className="map-label">Location data unavailable</p>
            </div>
        );
    }

    return (
        <div
            ref={mapContainer}
            className="leaflet-map-container"
            style={{ height: '100%', width: '100%', zIndex: 1 }}
        />
    );
}
