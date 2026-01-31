
import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { fetchBirds } from '../lib/api';
import BirdCard from '../components/BirdCard';
import '../styles/Discovery.css';

export default function Discovery() {
    const [birds, setBirds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();

    // Initialize search term from URL or empty string
    const initialQuery = searchParams.get('q') || '';
    const [searchTerm, setSearchTerm] = useState(initialQuery);

    useEffect(() => {
        async function loadBirds() {
            setLoading(true);
            // Pass searchTerm directly to API for server-side filtering
            const data = await fetchBirds(searchTerm);
            setBirds(data);
            setLoading(false);
        }

        // Debounce slightly to avoid pounding API on every keystroke
        const timeoutId = setTimeout(() => {
            loadBirds();
            // Update URL
            if (searchTerm) setSearchParams({ q: searchTerm });
            else setSearchParams({});
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, setSearchParams]);

    // We no longer need useMemo filtering since API does it
    const filteredBirds = birds;

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
