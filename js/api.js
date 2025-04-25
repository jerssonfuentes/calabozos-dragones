// Servicio para interactuar con APIs externas
class DnDAPI {
    constructor() {
        this.baseUrl = 'https://www.dnd5eapi.co/api';
        this.cache = {};
    }

    async fetchData(endpoint) {
        // Verificar caché primero
        if (this.cache[endpoint]) {
            return this.cache[endpoint];
        }

        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Almacenar en caché
            this.cache[endpoint] = data;
            
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    }

    // Métodos específicos para D&D API
    async getRaces() {
        try {
            const data = await this.fetchData('/races');
            return data.results;
        } catch (error) {
            console.error('Error getting races:', error);
            // Datos de respaldo
            return [
                { name: 'Human', index: 'human', url: '/api/races/human' },
                { name: 'Elf', index: 'elf', url: '/api/races/elf' },
                { name: 'Dwarf', index: 'dwarf', url: '/api/races/dwarf' },
                { name: 'Halfling', index: 'halfling', url: '/api/races/halfling' },
                { name: 'Dragonborn', index: 'dragonborn', url: '/api/races/dragonborn' }
            ];
        }
    }

    async getRaceDetails(raceIndex) {
        try {
            return await this.fetchData(`/races/${raceIndex}`);
        } catch (error) {
            console.error('Error getting race details:', error);
            // Datos de respaldo
            const fallbackRaces = {
                human: {
                    name: 'Human',
                    speed: 30,
                    ability_bonuses: [{ ability_score: { name: 'STR' }, bonus: 1 }],
                    alignment: 'Humans tend toward no particular alignment...',
                    age: 'Humans reach adulthood in their late teens...',
                    size: 'Medium',
                    size_description: 'Humans vary widely in height and build...',
                    starting_proficiencies: [],
                    languages: [],
                    traits: [],
                    subraces: []
                }
            };
            return fallbackRaces[raceIndex] || fallbackRaces.human;
        }
    }

    async getClasses() {
        try {
            const data = await this.fetchData('/classes');
            return data.results;
        } catch (error) {
            console.error('Error getting classes:', error);
            // Datos de respaldo
            return [
                { name: 'Fighter', index: 'fighter', url: '/api/classes/fighter' },
                { name: 'Wizard', index: 'wizard', url: '/api/classes/wizard' },
                { name: 'Rogue', index: 'rogue', url: '/api/classes/rogue' },
                { name: 'Cleric', index: 'cleric', url: '/api/classes/cleric' },
                { name: 'Barbarian', index: 'barbarian', url: '/api/classes/barbarian' }
            ];
        }
    }

    async getClassDetails(classIndex) {
        try {
            return await this.fetchData(`/classes/${classIndex}`);
        } catch (error) {
            console.error('Error getting class details:', error);
            // Datos de respaldo
            const fallbackClasses = {
                fighter: {
                    name: 'Fighter',
                    hit_die: 10,
                    proficiencies: [],
                    saving_throws: [],
                    starting_equipment: [],
                    class_levels: [],
                    subclasses: []
                }
            };
            return fallbackClasses[classIndex] || fallbackClasses.fighter;
        }
    }

    async getEquipment() {
        try {
            const data = await this.fetchData('/equipment');
            return data.results;
        } catch (error) {
            console.error('Error getting equipment:', error);
            // Datos de respaldo
            return [
                { name: 'Longsword', index: 'longsword', url: '/api/equipment/longsword' },
                { name: 'Chain Mail', index: 'chain-mail', url: '/api/equipment/chain-mail' },
                { name: 'Shortbow', index: 'shortbow', url: '/api/equipment/shortbow' }
            ];
        }
    }

    async getEquipmentDetails(equipmentIndex) {
        try {
            return await this.fetchData(`/equipment/${equipmentIndex}`);
        } catch (error) {
            console.error('Error getting equipment details:', error);
            // Datos de respaldo
            const fallbackEquipment = {
                'longsword': {
                    name: 'Longsword',
                    equipment_category: 'Weapon',
                    weapon_category: 'Martial',
                    weapon_range: 'Melee',
                    damage: { damage_dice: '1d8', damage_type: { name: 'Slashing' } },
                    properties: [{ name: 'Versatile' }]
                }
            };
            return fallbackEquipment[equipmentIndex] || fallbackEquipment.longsword;
        }
    }
}

// Instancia global de la API
const dndApi = new DnDAPI();

// Mock API para cuando no hay conexión o para desarrollo
class MockAPI {
    async getRaces() {
        return [
            { name: 'Human', index: 'human' },
            { name: 'Elf', index: 'elf' },
            { name: 'Dwarf', index: 'dwarf' },
            { name: 'Halfling', index: 'halfling' },
            { name: 'Dragonborn', index: 'dragonborn' }
        ];
    }

    async getRaceDetails(raceIndex) {
        const races = {
            human: { name: 'Human', speed: 30, ability_bonuses: [] },
            elf: { name: 'Elf', speed: 30, ability_bonuses: [] },
            dwarf: { name: 'Dwarf', speed: 25, ability_bonuses: [] }
        };
        return races[raceIndex] || races.human;
    }

    async getClasses() {
        return [
            { name: 'Fighter', index: 'fighter' },
            { name: 'Wizard', index: 'wizard' },
            { name: 'Rogue', index: 'rogue' }
        ];
    }

    async getEquipment() {
        return [
            { name: 'Longsword', index: 'longsword' },
            { name: 'Chain Mail', index: 'chain-mail' }
        ];
    }
}

// Exportar las APIs
export { dndApi, MockAPI };