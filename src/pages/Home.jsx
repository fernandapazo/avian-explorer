
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchBirds } from '../lib/api';
import BirdCard from '../components/BirdCard';
import { Hero, StatsBar } from '../components/home/HomeComponents';
import '../styles/Home.css';

export default function Home() {
    const [featuredBirds, setFeaturedBirds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadBirds() {
            const allBirds = await fetchBirds();
            // Pick 4 random birds for the featured section (matching design layout)
            const shuffled = allBirds.sort(() => 0.5 - Math.random());
            setFeaturedBirds(shuffled.slice(0, 4));
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
