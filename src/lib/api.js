
const API_URL = 'https://aves.ninjas.cl/api/birds';

export async function fetchBirds() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch birds');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching bird data:', error);
        return [];
    }
}

export async function fetchBirdById(uid) {
    try {
        const response = await fetch(`${API_URL}/${uid}`);
        if (!response.ok) {
            throw new Error('Failed to fetch bird details');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching bird details:', error);
        return null;
    }
}
