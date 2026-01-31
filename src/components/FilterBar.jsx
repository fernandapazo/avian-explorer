import { useState, useEffect } from 'react';
import '../styles/FilterBar.css';

// Filter options could be fetched from API in a real app, 
// but for this iteration we'll hardcode common ones to match Nuthatch data
const REGIONS = [
    'All',
    'North America',
    'South America',
    'Central America',
    'Western Europe',
    'Asia',
    'Africa',
    'Oceania'
];

const ORDERS = [
    'All',
    'Accipitriformes', // Hawks
    'Anseriformes',    // Ducks
    'Charadriiformes', // Shorebirds
    'Passeriformes',   // Songbirds
    'Pelecaniformes',  // Pelicans
    'Strigiformes',    // Owls
    // Add more as needed
];

const FAMILIES = [
    'All',
    'Accipitridae', // Hawks/Eagles
    'Anatidae',     // Ducks
    'Ardeidae',     // Herons
    'Corvidae',     // Crows
    'Fringillidae', // Finches
    'Laridae',      // Gulls
    'Parulidae',    // Warblers
    'Strigidae',    // Owls
    'Tytonidae',    // Barn Owls
];

const STATUSES = [
    'All',
    'Low Concern',
    'Declining',
    'Common Bird in Steep Decline',
    'Restricted Range',
    'Red Watch List'
];

export default function FilterBar({ filters, onFilterChange }) {
    const handleChange = (key, value) => {
        onFilterChange({ ...filters, [key]: value });
    };

    return (
        <div className="filter-bar">
            <div className="filter-group">
                <label>Region</label>
                <select
                    value={filters.region}
                    onChange={(e) => handleChange('region', e.target.value)}
                >
                    {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
            </div>

            <div className="filter-group">
                <label>Order</label>
                <select
                    value={filters.order}
                    onChange={(e) => handleChange('order', e.target.value)}
                >
                    {ORDERS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
            </div>

            <div className="filter-group">
                <label>Family</label>
                <select
                    value={filters.family}
                    onChange={(e) => handleChange('family', e.target.value)}
                >
                    {FAMILIES.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
            </div>

            <div className="filter-group">
                <label>Status</label>
                <select
                    value={filters.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                >
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
        </div>
    );
}
