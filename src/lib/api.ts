import { CollectionName } from './db';

const API_URL = '/api/db';

export const api = {
    get: async (collection: CollectionName) => {
        try {
            const res = await fetch(`${API_URL}?collection=${collection}`);
            if (!res.ok) throw new Error('Failed to fetch data');
            return await res.json();
        } catch (error) {
            console.error(`Error fetching ${collection}:`, error);
            return [];
        }
    },

    save: async (collection: CollectionName, data: any) => {
        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ collection, data }),
            });
            if (!res.ok) throw new Error('Failed to save data');
            return true;
        } catch (error) {
            console.error(`Error saving ${collection}:`, error);
            return false;
        }
    }
};
