document.addEventListener('DOMContentLoaded', async function() {
    // Elementos del DOM
    const charNameInput = document.getElementById('charName');
    const charGenderSelect = document.getElementById('charGender');
    const raceSearchInput = document.getElementById('raceSearch');
    const raceList = document.getElementById('raceList');
    const previewName = document.getElementById('previewName');
    const previewRace = document.getElementById('previewRace');
    const saveCharBtn = document.getElementById('saveCharBtn');
    
    // Datos del personaje actual
    let currentCharacter = {
        name: '',
        gender: 'male',
        race: null,
        class: null,
        equipment: [],
        abilities: [],
        stats: {
            strength: 10,
            dexterity: 10,
            constitution: 10,
            intelligence: 10,
            wisdom: 10,
            charisma: 10
        }
    };
    
    // Cargar razas desde la API
    async function loadRaces() {
        try {
            const response = await fetch('https://www.dnd5eapi.co/api/races');
            const data = await response.json();
            displayRaces(data.results);
        } catch (error) {
            console.error('Error al cargar razas:', error);
            // Fallback a datos locales si la API falla
            const fallbackRaces = [
                { name: 'Humano', index: 'human' },
                { name: 'Elfo', index: 'elf' },
                { name: 'Enano', index: 'dwarf' },
                { name: 'Mediano', index: 'halfling' },
                { name: 'Draconido', index: 'dragonborn' }
            ];
            displayRaces(fallbackRaces);
        }
    }
    
    // Mostrar razas en la lista
    function displayRaces(races) {
        raceList.innerHTML = '';
        races.forEach(race => {
            const raceItem = document.createElement('div');
            raceItem.className = 'option-item';
            raceItem.innerHTML = `
                <img src="https://www.dnd5eapi.co/api/races/${race.index}/image" 
                     alt="${race.name}" 
                     onerror="this.src='https://i.imgur.com/8Km9tLL.jpg'">
                <span>${race.name}</span>
            `;
            raceItem.addEventListener('click', () => selectRace(race));
            raceList.appendChild(raceItem);
        });
    }
    
    // Seleccionar una raza
    function selectRace(race) {
        currentCharacter.race = race;
        previewRace.textContent = `Raza: ${race.name}`;
        updatePreview();
    }
    
    // Actualizar vista previa
    function updatePreview() {
        previewName.textContent = currentCharacter.name || 'Nuevo Personaje';
        
        if (currentCharacter.race) {
            previewRace.textContent = `Raza: ${currentCharacter.race.name}`;
        }
        
        // Actualizar imagen según raza/género
        updateCharacterImage();
    }
    
    // Actualizar imagen del personaje
    function updateCharacterImage() {
        const charImage = document.getElementById('charImage');
        let imageUrl = 'https://i.imgur.com/8Km9tLL.jpg'; // Imagen por defecto
        
        if (currentCharacter.race) {
            // Intentar obtener imagen específica de la raza
            imageUrl = `https://www.dnd5eapi.co/api/races/${currentCharacter.race.index}/image`;
        }
        
        charImage.src = imageUrl;
        charImage.onerror = function() {
            this.src = 'https://i.imgur.com/8Km9tLL.jpg';
        };
    }
    
    // Guardar personaje
    function saveCharacter() {
        if (!currentCharacter.name) {
            alert('Por favor ingresa un nombre para tu personaje');
            return;
        }
        
        const savedCharacters = JSON.parse(localStorage.getItem('dnd_characters')) || [];
        currentCharacter.id = Date.now();
        savedCharacters.push(currentCharacter);
        localStorage.setItem('dnd_characters', JSON.stringify(savedCharacters));
        
        alert('Personaje guardado exitosamente!');
        resetCreator();
    }
    
    // Resetear creador
    function resetCreator() {
        currentCharacter = {
            name: '',
            gender: 'male',
            race: null,
            class: null,
            equipment: [],
            abilities: [],
            stats: {
                strength: 10,
                dexterity: 10,
                constitution: 10,
                intelligence: 10,
                wisdom: 10,
                charisma: 10
            }
        };
        
        charNameInput.value = '';
        charGenderSelect.value = 'male';
        updatePreview();
    }
    
    // Event listeners
    charNameInput.addEventListener('input', function() {
        currentCharacter.name = this.value;
        updatePreview();
    });
    
    charGenderSelect.addEventListener('change', function() {
        currentCharacter.gender = this.value;
        updatePreview();
    });
    
    raceSearchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const items = raceList.querySelectorAll('.option-item');
        
        items.forEach(item => {
            const name = item.textContent.toLowerCase();
            if (name.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    });
    
    saveCharBtn.addEventListener('click', saveCharacter);
    
    // Inicializar
    loadRaces();
    updatePreview();
});