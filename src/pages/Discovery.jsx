import { useEffect, useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { fetchBirds } from '../lib/api';
import BirdCard from '../components/BirdCard';
import '../styles/Discovery.css';

export default function Discovery() {
    const [birds, setBirds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        async function loadBirds() {
            const data = await fetchBirds();
            setBirds(data);
            setLoading(false);
        }
        loadBirds();
    }, []);

    const filteredBirds = useMemo(() => {
        return birds.filter(bird => {
            const term = searchTerm.toLowerCase();
            return (
                bird.name.english.toLowerCase().includes(term) ||
                bird.name.spanish.toLowerCase().includes(term) ||
                bird.name.latin.toLowerCase().includes(term)
            );
        });
    }, [birds, searchTerm]);

    return (
        <div className="discovery-page">
            <div className="container">
                <header className="discovery-header">
                    <h1 className="page-title">Bird Database</h1>
                    <div className="search-wrapper">
                        <Search className="search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name (English, Spanish, or Latin)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    <p className="results-count">
                        Showing {filteredBirds.length} species
                    </p>
                </header>

                {loading ? (
                    <div className="loading-grid">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="skeleton-card"></div>
                        ))}
                    </div>
                ) : (
                    <div className="birds-grid">
                        {filteredBirds.map(bird => (
                            <BirdCard key={bird.uid} bird={bird} />
                        ))}
                    </div>
                )}

                {!loading && filteredBirds.length === 0 && (
                    <div className="no-results">
                        <p>No birds found matching "{searchTerm}"</p>
                    </div>
                )}
            </div>
        </div>
    );
}
