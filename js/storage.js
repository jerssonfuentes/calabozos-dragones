class StorageService {
    constructor() {
      this.charactersKey = 'dnd_characters';
    }
  
    addCharacter(character) {
      try {
        const characters = this.getCharacters();
        
        // Validación básica
        if (!character.name || !character.race) {
          throw new Error('Personaje inválido');
        }
        
        // Asegurar imagen de respaldo
        const newCharacter = {
          ...character,
          id: Date.now(),
          image: character.race?.image || 'https://i.imgur.com/8Km9tLL.jpg'
        };
        
        localStorage.setItem(
          this.charactersKey,
          JSON.stringify([...characters, newCharacter])
        );
        return true;
      } catch (error) {
        console.error('Error guardando personaje:', error);
        return false;
      }
    }
  
    getCharacters() {
      try {
        return JSON.parse(localStorage.getItem(this.charactersKey)) || [];
      } catch (error) {
        console.error('Error leyendo almacenamiento:', error);
        return [];
      }
    }
  }
  
  export const storage = new StorageService();