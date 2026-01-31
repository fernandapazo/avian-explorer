import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchBirdById } from '../lib/api';
import { ArrowLeft } from 'lucide-react';
import '../styles/BirdDetail.css';

export default function BirdDetail() {
    const { uid } = useParams();
    const [bird, setBird] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadBird() {
            // Since the API uses generic numeric IDs or composite strings, we fetch by UID
            // Note: The main list endpoint returns full details for all birds, 
            // but the single endpoint might return specific details.
            // For this API, the individual endpoint structure is: /api/birds/{uid}
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
                <h2>Bird not found</h2>
                <Link to="/discovery" className="btn btn-primary">Back to Discovery</Link>
            </div>
        );
    }

    return (
        <div className="bird-detail-page">
            <div className="container">
                <Link to="/discovery" className="back-link">
                    <ArrowLeft size={20} /> Back to Database
                </Link>

                <div className="detail-card">
                    <div className="detail-image-wrapper">
                        <img
                            src={bird.images.full}
                            alt={bird.name.english}
                            className="detail-image"
                        />
                    </div>

                    <div className="detail-content">
                        <span className="detail-latin">{bird.name.latin}</span>
                        <h1 className="detail-title">{bird.name.english}</h1>
                        <h2 className="detail-spanish">{bird.name.spanish}</h2>

                        <div className="detail-meta">
                            <div className="meta-item">
                                <span className="meta-label">Sort Index</span>
                                <span className="meta-value">{bird.sort}</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-label">API UID</span>
                                <span className="meta-value">{bird.uid}</span>
                            </div>
                        </div>

                        <div className="detail-actions">
                            <a
                                href={bird._links.self}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary"
                            >
                                View Raw API Data
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
