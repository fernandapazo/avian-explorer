
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

export async function fetchBirds(query = '') {
    try {
        let url = `${API_URL}?page=1&pageSize=50&hasImg=true`;

        // Use server-side search if query exists
        if (query) {
            url += `&name=${encodeURIComponent(query)}`;
        }

        const response = await fetch(url, {
            headers: { 'api-key': API_KEY }
        });

        if (!response.ok) {
            console.error("API Error:", response.status);
            return [];
        }

        const data = await response.json();
        const entities = data.entities || [];

        // Dual-Strategy Normalizer:
        // Case A (List/Default): Entities are "Recordings" (fields: en, id, file)
        // Case B (Search): Entities are "Species" (fields: name, id, recordings[])

        const uniqueBirds = [];
        const seenNames = new Set();

        for (const item of entities) {
            // Determine English Name based on structure
            const englishName = item.name || item.en;

            if (!englishName) continue;

            if (!seenNames.has(englishName)) {
                seenNames.add(englishName);

                // Determine Audio
                // Case A: item.file
                // Case B: item.recordings[0].file
                let audioUrl = item.file;
                if (!audioUrl && item.recordings && item.recordings.length > 0) {
                    audioUrl = item.recordings[0].file;
                }

                // Determine Image (Nuthatch images can be in top-level or nested)
                // We primarily use our logical fallback if the API image is missing/broken
                const apiImage = (item.images && item.images.length > 0) ? item.images[0] : null;

                // Determine Coordinates
                let lat = item.lat;
                let lng = item.lng;

                // Fallback to recording coordinates if main item lacks them
                if ((!lat || !lng) && item.recordings && item.recordings.length > 0) {
                    const rec = item.recordings[0];
                    if (rec.lat && rec.lng) {
                        lat = rec.lat;
                        lng = rec.lng;
                    }
                }

                // Ensure they are numbers
                const coords = (lat && lng) ? { lat: parseFloat(lat), lng: parseFloat(lng) } : null;

                uniqueBirds.push({
                    // Use Name as ID for robust routing since numeric IDs vary between endpoints
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
                    location: item.cnt || (item.recordings && item.recordings[0]?.cnt) || "North America"
                });
            }
        }

        return uniqueBirds;
    } catch (error) {
        console.error('Error fetching bird data:', error);
        return [];
    }
}

// Fetch by Name using the search endpoint
export async function fetchBirdById(nameId) {
    if (!nameId) return null;

    // Use the search capability to find the specific bird
    const results = await fetchBirds(nameId);

    // Find exact match just in case search is fuzzy
    const match = results.find(b => b.name.english.toLowerCase() === nameId.toLowerCase());
    return match || results[0] || null;
}
