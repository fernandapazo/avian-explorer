import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchBirds } from '../lib/api';
import BirdCard from '../components/BirdCard';
import { Hero, StatsBar } from '../components/home/HomeComponents';
import HomeMap from '../components/home/HomeMap';
import '../styles/Home.css';

export default function Home() {
    const [featuredBirds, setFeaturedBirds] = useState([]);
    const [mapBirds, setMapBirds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadBirds() {
            const allBirds = await fetchBirds();

            // Pick 4 random birds for the featured section
            const shuffled = [...allBirds].sort(() => 0.5 - Math.random());
            setFeaturedBirds(shuffled.slice(0, 4));

            // Filter birds specifically for the map (must have coords)
            const birdsWithCoords = allBirds.filter(b => b.coords && b.coords.lat && b.coords.lng);
            // Pick a reasonable subset for the map to avoid clutter (e.g. 50 random ones)
            const mapSubset = birdsWithCoords.sort(() => 0.5 - Math.random()).slice(0, 50);
            setMapBirds(mapSubset);

            setLoading(false);
        }
        loadBirds();
    }, []);

    return (
        <div className="home-page">
            <Hero />
            <StatsBar />

            {/* Featured Section */}
            <section className="featured">
                <div className="container">
                    <div className="section-header">
                        <div>
                            <h2 className="section-title">Featured Species</h2>
                            <p className="section-desc">Discover the most viewed birds of the week.</p>
                        </div>
                        <Link to="/discovery" className="link-arrow">View Atlas →</Link>
                    </div>

                    {loading ? (
                        <div className="loading-grid">
                            <div className="skeleton-card"></div>
                            <div className="skeleton-card"></div>
                            <div className="skeleton-card"></div>
                            <div className="skeleton-card"></div>
                        </div>
                    ) : (
                        <div className="birds-grid">
                            {featuredBirds.map((bird, index) => (
                                <BirdCard key={index} bird={bird} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Global Sightings Map */}
            {!loading && <HomeMap birds={mapBirds} />}



            <section className="cta-section">
                <div className="container">
                    <div className="cta-card">
                        <h2 className="cta-title">Ready to start your avian adventure?</h2>
                        <p className="cta-text">Join 50,000+ birders using Avian Explorer every day to identify and track nature's beauty.</p>
                        <div className="cta-actions">
                            <button className="btn btn-primary">Download Mobile App</button>
                            <button className="btn btn-outline">Join Community</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
