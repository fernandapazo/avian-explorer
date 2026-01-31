
import { useState } from 'react';
import { Search, MapPin, Activity, Users, Globe } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/Home.css';

export function Hero() {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/discovery?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <section className="hero">
            <div className="hero-overlay"></div>
            <div className="container hero-content">
                <div className="hero-badge">
                    <Activity size={16} /> Beta v2.0
                </div>
                <h1 className="hero-title">
                    Identify and Explore <br />
                    <span className="text-gradient">North American Birds</span>
                </h1>
                <p className="hero-subtitle">
                    The ultimate companion for bird enthusiasts. Access our
                    community database, listen to calls, and track your discoveries.
                </p>

                <form onSubmit={handleSearch} className="hero-search-bar">
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, color, or behavior..."
                        className="hero-input"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary search-btn">Search Database</button>
                </form>

                <div className="hero-stats">
                    <span className="stat-pill">Trending:</span>
                    <Link to="/discovery?q=Bluebird" className="stat-link">Mountain Bluebird</Link>
                    <Link to="/discovery?q=Eagle" className="stat-link">Bald Eagle</Link>
                    <Link to="/discovery?q=Cardinal" className="stat-link">Cardinal</Link>
                </div>
            </div>
        </section>
    );
}

export function StatsBar() {
    return (
        <section className="stats-bar">
            <div className="container stats-grid">
                <div className="stat-item">
                    <span className="stat-value">1,500+</span>
                    <span className="stat-label">Species Database</span>
                </div>
                <div className="stat-item">
                    <span className="stat-value">500k+</span>
                    <span className="stat-label">Photos Shared</span>
                </div>
                <div className="stat-item">
                    <span className="stat-value">24/7</span>
                    <span className="stat-label">AI Identification</span>
                </div>
                <div className="stat-item">
                    <span className="stat-value">150+</span>
                    <span className="stat-label">Active Regions</span>
                </div>
            </div>
        </section>
    );
}
