
import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { fetchBirds } from '../lib/api';
import BirdCard from '../components/BirdCard';
import FilterBar from '../components/FilterBar';
import '../styles/Discovery.css';

export default function Discovery() {
    const [allBirds, setAllBirds] = useState([]); // Store master list
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();

    // Initialize search term from URL or empty string
    const initialQuery = searchParams.get('q') || '';
    const [searchTerm, setSearchTerm] = useState(initialQuery);

    // Filter State
    const [filters, setFilters] = useState({
        region: 'All',
        order: 'All',
        family: 'All',
        status: 'All'
    });

    // 1. Fetch ALL data once on mount
    useEffect(() => {
        async function loadData() {
            setLoading(true);
            // Fetch everything (empty query, empty filters)
            // api.js is effectively a "data syncer" now
            const data = await fetchBirds();
            setAllBirds(data);
            setLoading(false);
        }
        loadData();
    }, []);

    // 2. Sync URL with Search Term (Debounced)
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchTerm) setSearchParams({ q: searchTerm });
            else setSearchParams({});
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [searchTerm, setSearchParams]);

    // 3. Client-Side Filtering (Instant)
    const filteredBirds = useMemo(() => {
        return allBirds.filter(bird => {
            // Text Search
            if (searchTerm) {
                const q = searchTerm.toLowerCase();
                const matchesName = bird.name.english.toLowerCase().includes(q) ||
                    bird.name.latin.toLowerCase().includes(q) ||
                    bird.name.spanish.toLowerCase().includes(q);
                if (!matchesName) return false;
            }

            // Region
            if (filters.region !== 'All') {
                const birdRegions = Array.isArray(bird.rawRegion) ? bird.rawRegion : [bird.rawRegion];
                const matchesRegion = birdRegions.some(r => r && r.includes(filters.region)) ||
                    (bird.location && bird.location.includes(filters.region));
                if (!matchesRegion) return false;
            }

            // Order
            if (filters.order !== 'All') {
                if (bird.rawOrder !== filters.order) return false;
            }

            // Family
            if (filters.family !== 'All') {
                if (bird.rawFamily !== filters.family) return false;
            }

            // Status
            if (filters.status !== 'All') {
                if (bird.conservationStatus !== filters.status) return false;
            }

            return true;
        });
    }, [allBirds, searchTerm, filters]);

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

                <FilterBar filters={filters} onFilterChange={setFilters} />

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
