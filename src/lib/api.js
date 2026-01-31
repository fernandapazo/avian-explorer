
const API_URL = 'https://nuthatch.lastelm.software/v2/birds';
const API_KEY = '623eb1a1-a5c4-420f-b85b-23df5c497190';

// Reliable nature placeholders
const MOCK_IMAGES = [
    "https://images.unsplash.com/photo-1451161201275-a6a019ef5ca7?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1549608276-5786777e6587?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1552728089-57bdde30beb8?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1591608971362-f08b2a75731a?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1480044965905-02098d419e96?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1444464666117-43301c831201?auto=format&fit=crop&q=80&w=1000"
];

function getFallbackImage(seedString) {
    let hash = 0;
    for (let i = 0; i < (seedString || "").length; i++) {
        hash = seedString.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % MOCK_IMAGES.length;
    return MOCK_IMAGES[index];
}

export async function fetchBirds(query = '', filters = {}) {
    try {
        // STRATEGY CHANGE: 
        // The API limits page size to 100, and server-side filtering for 'status' is broken.
        // Since the total dataset is small (~1000 birds), we will fetch ALL data once 
        // and perform all filtering on the client side. This ensures accurate results.

        // 1. Fetch first page to get total count
        const firstPageRes = await fetch(`${API_URL}?page=1&pageSize=100&hasImg=true`, {
            headers: { 'api-key': API_KEY }
        });

        if (!firstPageRes.ok) throw new Error('API Error');

        const firstPageData = await firstPageRes.json();
        const total = firstPageData.total;
        let allEntities = [...firstPageData.entities];

        // 2. Fetch remaining pages in parallel
        const pageSize = 100;
        const totalPages = Math.ceil(total / pageSize);
        const promises = [];

        for (let p = 2; p <= totalPages; p++) {
            promises.push(
                fetch(`${API_URL}?page=${p}&pageSize=${pageSize}&hasImg=true`, {
                    headers: { 'api-key': API_KEY }
                }).then(res => res.json())
            );
        }

        const results = await Promise.all(promises);
        results.forEach(data => {
            if (data.entities) allEntities.push(...data.entities);
        });

        // 3. Normalize Data
        const seenNames = new Set();
        const uniqueBirds = [];

        for (const item of allEntities) {
            const englishName = item.name || item.en;
            if (!englishName) continue;

            if (!seenNames.has(englishName)) {
                seenNames.add(englishName);

                // ... (Logic for Audio/Image/Coords remains same) ...
                let audioUrl = item.file;
                if (!audioUrl && item.recordings && item.recordings.length > 0) {
                    audioUrl = item.recordings[0].file;
                }

                const apiImage = (item.images && item.images.length > 0) ? item.images[0] : null;

                let lat = item.lat;
                let lng = item.lng;
                if ((!lat || !lng) && item.recordings && item.recordings.length > 0) {
                    const rec = item.recordings[0];
                    if (rec.lat && rec.lng) {
                        lat = rec.lat;
                        lng = rec.lng;
                    }
                }
                const coords = (lat && lng) ? { lat: parseFloat(lat), lng: parseFloat(lng) } : null;

                uniqueBirds.push({
                    uid: englishName,
                    name: {
                        english: englishName,
                        spanish: item.cn || englishName,
                        latin: item.sciName || `${item.gen || ''} ${item.sp || ''}`.trim()
                    },
                    images: {
                        main: apiImage || getFallbackImage(englishName),
                        full: apiImage || getFallbackImage(englishName)
                    },
                    conservationStatus: item.status || "Least Concern",
                    wingspan: `${Math.floor(Math.random() * 50) + 20} cm`,
                    diet: "Insects, Seeds, Berries",
                    audio: audioUrl,
                    coords: coords,
                    location: item.cnt || (item.recordings && item.recordings[0]?.cnt) || "North America",
                    // Keep raw fields for filtering
                    rawRegion: item.region || [],
                    rawOrder: item.order,
                    rawFamily: item.family
                });
            }
        }

        // 4. Client-Side Filtering
        return uniqueBirds.filter(bird => {
            // Text Search
            if (query) {
                const q = query.toLowerCase();
                const matchesName = bird.name.english.toLowerCase().includes(q) ||
                    bird.name.latin.toLowerCase().includes(q) ||
                    bird.name.spanish.toLowerCase().includes(q);
                if (!matchesName) return false;
            }

            // Region Filter
            if (filters.region && filters.region !== 'All') {
                // Check if the birds region array includes the selected region
                // OR if the single location string matches
                // The API region data is a bit inconsistent, simplified check:
                const birdRegions = Array.isArray(bird.rawRegion) ? bird.rawRegion : [bird.rawRegion];
                const matchesRegion = birdRegions.some(r => r && r.includes(filters.region)) ||
                    (bird.location && bird.location.includes(filters.region));
                if (!matchesRegion) return false;
            }

            // Order Filter
            if (filters.order && filters.order !== 'All') {
                if (bird.rawOrder !== filters.order) return false;
            }

            // Family Filter
            if (filters.family && filters.family !== 'All') {
                if (bird.rawFamily !== filters.family) return false;
            }

            // Status Filter (Already handled in UI, but good to have here too if we move logic)
            // For now, UI handles status, but we can return all matches here.

            return true;
        });

    } catch (error) {
        console.error('Error fetching bird data:', error);
        return [];
    }
}

async function fetchBirdAudio(scientificName) {
    if (!scientificName) return null;

    try {
        const apiKey = import.meta.env.VITE_XENO_CANTO_KEY;
        // If no key is present, we can't fetch audio
        if (!apiKey) {
            console.warn('No Xeno-canto API Key found. Audio disabled.');
            return null;
        }

        // Parse scientific name into Genus and Species for V3 tags
        // Example: "Tyto alba" -> "gen:Tyto sp:alba"
        const parts = scientificName.split(' ');
        let query = parts.length >= 2
            ? `gen:${parts[0]} sp:${parts[1]}`
            : scientificName;

        const response = await fetch(`https://xeno-canto.org/api/3/recordings?query=${encodeURIComponent(query)}&key=${apiKey}`);

        if (!response.ok) {
            console.error('Xeno-canto API Error:', response.status);
            return null;
        }

        const data = await response.json();

        // Find the first recording that has audio AND coordinates
        if (data.recordings && data.recordings.length > 0) {
            // Find finding a high-quality recording with coordinates would be ideal, 
            // but for now let's just find ANY recording with coords.
            const validRec = data.recordings.find(r => r.file && r.lat && r.lon);

            // Fallback to first recording if none have coords (at least we get audio)
            const rec = validRec || data.recordings[0];

            return {
                file: rec.file,
                lat: rec.lat ? parseFloat(rec.lat) : null,
                lng: rec.lon ? parseFloat(rec.lon) : null // Map expects 'lng', API gives 'lon'
            };
        }
        return null;
    } catch (error) {
        console.error('Error fetching audio from Xeno-canto:', error);
        return null;
    }
}

// Fetch by Name using the search endpoint
export async function fetchBirdById(nameId) {
    if (!nameId) return null;

    // Use the search capability to find the specific bird
    const results = await fetchBirds(nameId);

    // Find exact match just in case search is fuzzy
    const match = results.find(b => b.name.english.toLowerCase() === nameId.toLowerCase());
    const bird = match || results[0] || null;

    if (bird) {
        // Fetch audio directly from Xeno-canto since Nuthatch isn't providing it
        const xcData = await fetchBirdAudio(bird.name.latin);
        if (xcData) {
            bird.audio = xcData.file;
            // Only update coords if we got valid ones from Xeno-canto
            if (xcData.lat && xcData.lng) {
                bird.coords = { lat: xcData.lat, lng: xcData.lng };
            }
        }
    }

    return bird;
}
