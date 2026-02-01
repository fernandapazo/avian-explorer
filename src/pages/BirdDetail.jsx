
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchBirdById } from '../lib/api';
import { ArrowLeft } from 'lucide-react';
import { DetailHero, InfoGateway, AudioPlayer } from '../components/detail/DetailComponents';
import SightingMap from '../components/detail/SightingMap';
import ImageGallery from '../components/detail/ImageGallery';
import '../styles/BirdDetail.css';

export default function BirdDetail() {
    const { uid } = useParams();
    const [bird, setBird] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAudio, setShowAudio] = useState(false);
    const [showGallery, setShowGallery] = useState(false);

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

            <DetailHero
                bird={bird}
                onPlay={() => setShowAudio(true)}
                onGallery={() => setShowGallery(true)}
            />

            {/* Audio Player Section */}
            <AudioPlayer audioUrl={bird.audio} visible={showAudio} />

            <InfoGateway bird={bird} />

            <section className="map-section container">
                <h3 className="section-label">Sighting Map</h3>
                <div className="map-wrapper" style={{ height: '400px', borderRadius: '1rem', overflow: 'hidden' }}>
                    <SightingMap coords={bird.coords} placeName={bird.location} />
                </div>
            </section>

            <ImageGallery
                images={bird.images.all}
                isOpen={showGallery}
                onClose={() => setShowGallery(false)}
            />

        </div>
    );
}
