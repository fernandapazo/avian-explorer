
import { Link } from 'react-router-dom';
import { MapPin, Wind } from 'lucide-react';
import '../styles/BirdCard.css';

export default function BirdCard({ bird }) {
    const getStatusColor = (status) => {
        const s = status.toLowerCase();

        // Red - High Danger
        if (s.includes('endangered') || s.includes('watch list')) return 'red';

        // Orange - Concerning
        if (s.includes('vulnerable') || s.includes('steep decline')) return 'orange';

        // Yellow - Watch Closely / Restricted
        if (s.includes('declining') || s.includes('threatened') || s.includes('restricted')) return 'yellow';

        // Green - Safe
        if (s.includes('concern') || s.includes('stable')) return 'green';

        return 'green'; // Default
    };

    const statusColor = getStatusColor(bird.conservationStatus);

    return (
        <Link to={`/bird/${bird.uid}`} className="bird-card group">
            <div className="bird-card-image-wrapper">
                <img
                    src={bird.images.main}
                    alt={bird.name.english}
                    className="bird-card-image"
                    loading="lazy"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1552728089-57bdde30beb8?auto=format&fit=crop&q=80&w=1000';
                    }}
                />
            </div>
            <div className="bird-card-content">
                <div className="card-header">
                    <h3 className="bird-card-title">{bird.name.english}</h3>
                    <span className={`status-dot ${statusColor}`} title={bird.conservationStatus}></span>
                </div>
                <p className="bird-card-latin">{bird.name.latin}</p>

                <div className="card-footer">
                    <div className="footer-item">
                        <MapPin size={12} /> {bird.location}
                    </div>
                </div>
            </div>
        </Link>
    );
}
