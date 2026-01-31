
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchBirdById } from '../lib/api';
import { ArrowLeft } from 'lucide-react';
import { DetailHero, InfoGateway, AudioPlayer } from '../components/detail/DetailComponents';
import '../styles/BirdDetail.css';

export default function BirdDetail() {
    const { uid } = useParams();
    const [bird, setBird] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadBird() {
            const data = await fetchBirdById(uid);
            setBird(data);
            setLoading(false);
        }
        loadBird();
    }, [uid]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!bird) {
        return (
            <div className="error-container">
                <h2>Bird not found in database</h2>
                <Link to="/discovery" className="btn btn-primary">Back to Discovery</Link>
            </div>
        );
    }

    return (
        <div className="bird-detail-page">
            <div className="nav-strip">
                <div className="container">
                    <Link to="/discovery" className="back-link">
                        <ArrowLeft size={16} /> Back to Atlas
                    </Link>
                </div>
            </div>

            <DetailHero bird={bird} />

            {/* Audio Player Section */}
            {bird.audio && <AudioPlayer audioUrl={bird.audio} />}

            <InfoGateway bird={bird} />

            <section className="map-section container">
                <h3 className="section-label">Sighting Map</h3>
                <div className="map-placeholder">
                    <div className="map-marker"></div>
                    <p className="map-label">Recent sighting near {bird.location}</p>
                </div>
            </section>

        </div>
    );
}
