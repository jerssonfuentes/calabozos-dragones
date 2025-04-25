document.addEventListener('DOMContentLoaded', function() {
    const charactersContainer = document.getElementById('charactersContainer');
    
    function loadCharacters() {
        const savedCharacters = JSON.parse(localStorage.getItem('dnd_characters')) || [];
        
        if (savedCharacters.length === 0) {
            charactersContainer.innerHTML = `
                <div class="empty-message">
                    <i class="fas fa-users-slash"></i>
                    <p>No tienes personajes guardados</p>
                    <a href="creator.html" class="cta-btn">Crear un Personaje</a>
                </div>
            `;
            return;
        }
        
        charactersContainer.innerHTML = '';
        savedCharacters.forEach(character => {
            const charCard = document.createElement('div');
            charCard.className = 'character-card';
            charCard.innerHTML = `
                <div class="char-image">
                    <img src="${character.race ? `https://www.dnd5eapi.co/api/races/${character.race.index}/image` : 'https://i.imgur.com/8Km9tLL.jpg'}" 
                         onerror="this.src='https://i.imgur.com/8Km9tLL.jpg'">
                </div>
                <div class="char-info">
                    <h3>${character.name}</h3>
                    <p><strong>Raza:</strong> ${character.race?.name || 'No definida'}</p>
                    <p><strong>Género:</strong> ${character.gender === 'male' ? 'Masculino' : character.gender === 'female' ? 'Femenino' : 'Otro'}</p>
                    <button class="view-btn" data-id="${character.id}">
                        <i class="fas fa-eye"></i> Ver Detalles
                    </button>
                    <button class="delete-btn" data-id="${character.id}">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            `;
            charactersContainer.appendChild(charCard);
        });
        
        // Agregar event listeners a los botones
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                viewCharacterDetails(this.dataset.id);
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                deleteCharacter(this.dataset.id);
            });
        });
    }
    
    function viewCharacterDetails(id) {
        const savedCharacters = JSON.parse(localStorage.getItem('dnd_characters')) || [];
        const character = savedCharacters.find(c => c.id == id);
        
        if (character) {
            // Mostrar modal con detalles
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <h2>${character.name}</h2>
                    <div class="modal-grid">
                        <div class="modal-image">
                            <img src="${character.race ? `https://www.dnd5eapi.co/api/races/${character.race.index}/image` : 'https://i.imgur.com/8Km9tLL.jpg'}" 
                                 onerror="this.src='https://i.imgur.com/8Km9tLL.jpg'">
                        </div>
                        <div class="modal-details">
                            <p><strong>Raza:</strong> ${character.race?.name || 'No definida'}</p>
                            <p><strong>Género:</strong> ${character.gender === 'male' ? 'Masculino' : character.gender === 'female' ? 'Femenino' : 'Otro'}</p>
                            <h3>Estadísticas</h3>
                            <div class="stats-grid">
                                <div>Fuerza: ${character.stats.strength}</div>
                                <div>Destreza: ${character.stats.dexterity}</div>
                                <div>Constitución: ${character.stats.constitution}</div>
                                <div>Inteligencia: ${character.stats.intelligence}</div>
                                <div>Sabiduría: ${character.stats.wisdom}</div>
                                <div>Carisma: ${character.stats.charisma}</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Cerrar modal
            modal.querySelector('.close-modal').addEventListener('click', () => {
                modal.remove();
            });
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                }
            });
        }
    }
    
    function deleteCharacter(id) {
        if (confirm('¿Estás seguro de que quieres eliminar este personaje?')) {
            let savedCharacters = JSON.parse(localStorage.getItem('dnd_characters')) || [];
            savedCharacters = savedCharacters.filter(c => c.id != id);
            localStorage.setItem('dnd_characters', JSON.stringify(savedCharacters));
            loadCharacters();
        }
    }
    
    // Inicializar
    loadCharacters();
});