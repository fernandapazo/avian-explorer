import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchBirds } from '../lib/api';
import BirdCard from '../components/BirdCard';
import '../styles/Home.css';

export default function Home() {
    const [featuredBirds, setFeaturedBirds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadBirds() {
            const allBirds = await fetchBirds();
            // Pick 3 random birds for the featured section
            const shuffled = allBirds.sort(() => 0.5 - Math.random());
            setFeaturedBirds(shuffled.slice(0, 3));
            setLoading(false);
        }
        loadBirds();
    }, []);

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="container hero-container">
                    <h1 className="hero-title">Discover the Avian World of Chile</h1>
                    <p className="hero-subtitle">
                        Explore diverse species from the Andes to the Pacific.
                        Identify, catalog, and learn about our feathered friends.
                    </p>
                    <div className="hero-actions">
                        <Link to="/discovery" className="btn btn-primary">Start Exploring</Link>
                    </div>
                </div>
            </section>

            {/* Featured Section */}
            <section className="featured">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Featured Species</h2>
                        <Link to="/discovery" className="link-arrow">View All →</Link>
                    </div>

                    {loading ? (
                        <div className="loading-grid">
                            <div className="skeleton-card"></div>
                            <div className="skeleton-card"></div>
                            <div className="skeleton-card"></div>
                        </div>
                    ) : (
                        <div className="birds-grid">
                            {featuredBirds.map(bird => (
                                <BirdCard key={bird.uid} bird={bird} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
