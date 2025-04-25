// Servicio para manejar el almacenamiento local
class StorageService {
    constructor() {
        this.userKey = 'dnd_users';
        this.charactersKey = 'dnd_characters';
        this.currentUserKey = 'currentUser';
    }

    // Usuarios
    getUsers() {
        return JSON.parse(localStorage.getItem(this.userKey)) || [];
    }

    saveUsers(users) {
        localStorage.setItem(this.userKey, JSON.stringify(users));
    }

    addUser(user) {
        const users = this.getUsers();
        users.push(user);
        this.saveUsers(users);
    }

    findUser(username) {
        const users = this.getUsers();
        return users.find(u => u.username === username);
    }

    // Personajes
    getCharacters() {
        return JSON.parse(localStorage.getItem(this.charactersKey)) || [];
    }

    getCharactersByUser(username) {
        const allCharacters = this.getCharacters();
        return allCharacters.filter(c => c.user === username);
    }

    saveCharacters(characters) {
        localStorage.setItem(this.charactersKey, JSON.stringify(characters));
    }

    addCharacter(character) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return false;

        character.user = currentUser.username;
        character.id = Date.now();
        
        const characters = this.getCharacters();
        characters.push(character);
        this.saveCharacters(characters);
        
        return true;
    }

    deleteCharacter(id) {
        const characters = this.getCharacters();
        const updated = characters.filter(c => c.id !== id);
        this.saveCharacters(updated);
        return updated.length !== characters.length;
    }

    // Sesión actual
    setCurrentUser(user) {
        sessionStorage.setItem(this.currentUserKey, JSON.stringify(user));
    }

    getCurrentUser() {
        return JSON.parse(sessionStorage.getItem(this.currentUserKey));
    }

    clearCurrentUser() {
        sessionStorage.removeItem(this.currentUserKey);
    }

    // Métodos auxiliares
    isAuthenticated() {
        return !!this.getCurrentUser();
    }

    // Estadísticas (para la landing page)
    getStats() {
        const stats = {
            totalUsers: 0,
            totalCharacters: 0,
            mostPopularRace: 'N/A',
            mostPopularClass: 'N/A'
        };

        const users = this.getUsers();
        const characters = this.getCharacters();

        if (users.length > 0) {
            stats.totalUsers = users.length;
        }

        if (characters.length > 0) {
            stats.totalCharacters = characters.length;

            // Calcular raza más popular
            const raceCount = {};
            characters.forEach(c => {
                if (c.race) {
                    raceCount[c.race.name] = (raceCount[c.race.name] || 0) + 1;
                }
            });

            if (Object.keys(raceCount).length > 0) {
                stats.mostPopularRace = Object.entries(raceCount)
                    .sort((a, b) => b[1] - a[1])[0][0];
            }

            // Calcular clase más popular
            const classCount = {};
            characters.forEach(c => {
                if (c.class) {
                    classCount[c.class.name] = (classCount[c.class.name] || 0) + 1;
                }
            });

            if (Object.keys(classCount).length > 0) {
                stats.mostPopularClass = Object.entries(classCount)
                    .sort((a, b) => b[1] - a[1])[0][0];
            }
        }

        return stats;
    }
}

// Instancia global del servicio de almacenamiento
const storage = new StorageService();

export default storage;