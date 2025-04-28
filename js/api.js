class DnDAPI {
    constructor() {
        this.baseUrl = 'https://www.dnd5eapi.co/api';
        this.cache = new Map();
    }

    async fetchData(endpoint) {
        if (this.cache.has(endpoint)) {
            return this.cache.get(endpoint);
        }

        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`);
            if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
            const data = await response.json();
            this.cache.set(endpoint, data);
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw new Error(`Failed to fetch ${endpoint}: ${error.message}`);
        }
    }

    // ... (métodos restantes se mantienen igual) ...
}

export const dndApi = new DnDAPI();