
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import '../../styles/HomeMap.css';

// Fix for default marker icon issues
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

export default function HomeMap({ birds }) {
    const mapContainer = useRef(null);
    const mapInstance = useRef(null);

    useEffect(() => {
        if (!mapContainer.current || !birds || birds.length === 0) return;

        // Initialize map if not done
        if (!mapInstance.current) {
            // Center roughly on Americas/Atlantic for best initial spread of our data
            mapInstance.current = L.map(mapContainer.current).setView([20, -50], 3);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(mapInstance.current);
        }

        // Add markers
        // Clear existing markers first isntead of fully re-init map to keep state smooth
        // Actually for simplicity in this effect, we can just clear layers.
        // But since birds prop likely won't change often after load, standard unique add is ok.

        // Let's use a FeatureGroup to hold markers so we can clear them easily
        const markersLayer = L.featureGroup().addTo(mapInstance.current);

        birds.forEach(bird => {
            if (bird.coords && bird.coords.lat && bird.coords.lng) {
                const marker = L.marker([bird.coords.lat, bird.coords.lng]);

                // Custom Popup Content
                const popupContent = `
                    <div class="map-popup-card">
                        <img src="${bird.images.main}" alt="${bird.name.english}" />
                        <div class="popup-info">
                            <h4>${bird.name.english}</h4>
                            <p>${bird.location}</p>
                            <a href="/bird/${bird.uid}" class="popup-link">View Details</a>
                        </div>
                    </div>
                `;

                marker.bindPopup(popupContent);
                marker.addTo(markersLayer);
            }
        });

        // Optional: Fit bounds to show all markers
        // if (markersLayer.getLayers().length > 0) {
        //     mapInstance.current.fitBounds(markersLayer.getBounds(), { padding: [50, 50] });
        // }

        return () => {
            // Cleanup is tricky with React StrictMode double invoke, 
            // but usually we want to keep map instance alive if possible or destroy it.
            // For simple home page, we can destroy.
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, [birds]);

    return (
        <section className="home-map-section">
            <div className="container">
                <div className="section-header center">
                    <h2 className="section-title">Global Sightings</h2>
                    <p className="section-desc">Explore recent bird sightings from our community around the world.</p>
                </div>

                <div className="map-frame">
                    <div ref={mapContainer} className="home-map-container" />
                </div>
            </div>
        </section>
    );
}
