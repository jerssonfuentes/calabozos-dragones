class DnDAPI {
    constructor() {
        this.baseUrl = 'https://www.dnd5eapi.co/api';
        this.cache = new Map();
    }

    async fetchData(endpoint) {
        if (this.cache.has(endpoint)) return this.cache.get(endpoint);
        
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`);
            if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
            const data = await response.json();
            this.cache.set(endpoint, data);
            return data;
        } catch (error) {
            console.error(`API Error: ${error.message}`);
            throw error;
        }
    }

    async getRaces() { return this.fetchData('/races'); }
    async getClasses() { return this.fetchData('/classes'); }
    async getRaceDetails(index) { return this.fetchData(`/races/${index}`); }
    async getClassDetails(index) { return this.fetchData(`/classes/${index}`); }
}

export const dndApi = new DnDAPI();