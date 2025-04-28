import { dndApi } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
    const character = {
        name: '',
        race: null,
        class: null,
        gender: 'other',
        alignment: 'n',
        background: 'acolyte',
        stats: {
            strength: 10,
            dexterity: 10,
            constitution: 10,
            intelligence: 10,
            wisdom: 10,
            charisma: 10
        }
    };

    const DOM = {
        charName: document.getElementById('charName'),
        charGender: document.getElementById('charGender'),
        charAlignment: document.getElementById('charAlignment'),
        charBackground: document.getElementById('charBackground'),
        raceList: document.getElementById('raceList'),
        classList: document.getElementById('classList'),
        previewName: document.getElementById('previewName'),
        previewRace: document.getElementById('previewRace'),
        previewClass: document.getElementById('previewClass'),
        charImage: document.getElementById('charImage'),
        statsContainer: document.getElementById('statsContainer'),
        saveBtn: document.getElementById('saveBtn'),
        raceSearch: document.getElementById('raceSearch'),
        classSearch: document.getElementById('classSearch')
    };

    const init = async () => {
        await loadRaces();
        await loadClasses();
        setupStats();
        setupEventListeners();
        setupTabNavigation();
    };

    const loadRaces = async () => {
        try {
            const { results } = await dndApi.getRaces();
            renderRaces(results);
            setupSearch(DOM.raceSearch, results, renderRaces);
        } catch (error) {
            DOM.raceList.innerHTML = `<div class="error">${error.message}</div>`;
        }
    };

    const loadClasses = async () => {
        try {
            const { results } = await dndApi.getClasses();
            renderClasses(results);
            setupSearch(DOM.classSearch, results, renderClasses);
        } catch (error) {
            DOM.classList.innerHTML = `<div class="error">${error.message}</div>`;
        }
    };

    const renderRaces = (races) => {
        DOM.raceList.innerHTML = races.map(race => `
            <div class="option-item ${character.race?.index === race.index ? 'selected' : ''}" 
                 data-race="${race.index}">
                <h3>${race.name}</h3>
                <p>${race.alignment || 'Alineamiento variado'}</p>
            </div>
        `).join('');

        document.querySelectorAll('.option-item[data-race]').forEach(item => {
            item.addEventListener('click', async () => {
                document.querySelectorAll('[data-race]').forEach(el => el.classList.remove('selected'));
                item.classList.add('selected');
                
                try {
                    character.race = await dndApi.getRaceDetails(item.dataset.race);
                    updatePreview();
                } catch (error) {
                    console.error('Error loading race details:', error);
                }
            });
        });
    };

    const renderClasses = (classes) => {
        DOM.classList.innerHTML = classes.map(cls => `
            <div class="option-item ${character.class?.index === cls.index ? 'selected' : ''}" 
                 data-class="${cls.index}">
                <h3>${cls.name}</h3>
                <p>Dado de golpe: ${cls.hit_die || '1d8'}</p>
            </div>
        `).join('');

        document.querySelectorAll('.option-item[data-class]').forEach(item => {
            item.addEventListener('click', async () => {
                document.querySelectorAll('[data-class]').forEach(el => el.classList.remove('selected'));
                item.classList.add('selected');
                
                try {
                    character.class = await dndApi.getClassDetails(item.dataset.class);
                    updatePreview();
                } catch (error) {
                    console.error('Error loading class details:', error);
                }
            });
        });
    };

    const setupStats = () => {
        const stats = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
        DOM.statsContainer.innerHTML = stats.map(stat => `
            <div class="stat-item">
                <div class="stat-circle">
                    <input type="number" min="8" max="20" value="10" 
                           data-stat="${stat}" 
                           class="stat-input"
                           aria-label="${stat}">
                </div>
                <label>${stat.slice(0, 3).toUpperCase()}</label>
            </div>
        `).join('');

        document.querySelectorAll('.stat-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const stat = e.target.dataset.stat;
                character.stats[stat] = parseInt(e.target.value) || 10;
                e.target.value = character.stats[stat]; // Force valid value
            });
        });
    };

    const updatePreview = () => {
        DOM.previewName.textContent = character.name || 'Nombre del Personaje';
        DOM.previewRace.innerHTML = character.race 
            ? `<strong>Raza:</strong> ${character.race.name}`
            : 'No seleccionada';
        
        DOM.previewClass.innerHTML = character.class 
            ? `<strong>Clase:</strong> ${character.class.name}`
            : 'No seleccionada';

        // Actualizar imagen con efecto de respaldo
        DOM.charImage.src = character.race?.image 
            ? `https://www.dnd5eapi.co${character.race.image}`
            : 'https://i.imgur.com/8Km9tLL.jpg';
        
        validateCharacter();
    };

    const setupEventListeners = () => {
        DOM.charName.addEventListener('input', (e) => {
            character.name = e.target.value.trim();
            updatePreview();
        });

        DOM.charGender.addEventListener('change', (e) => {
            character.gender = e.target.value;
        });

        DOM.charAlignment.addEventListener('change', (e) => {
            character.alignment = e.target.value;
        });

        DOM.charBackground.addEventListener('change', (e) => {
            character.background = e.target.value;
        });

        DOM.saveBtn.addEventListener('click', () => {
            if (validateCharacter()) saveCharacter();
            else alert('¡Completa todos los campos requeridos!');
        });
    };

    const setupTabNavigation = () => {
        // Manejo de pestañas
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => switchTab(btn.dataset.target));
        });

        // Botones de navegación
        document.querySelectorAll('.prev-btn, .next-btn').forEach(btn => {
            btn.addEventListener('click', () => switchTab(btn.dataset.target));
        });
    };

    const switchTab = (targetId) => {
        // Desactivar todo
        document.querySelectorAll('.tab-btn, .tab-content').forEach(el => {
            el.classList.remove('active');
        });

        // Activar nuevo
        const targetTab = document.getElementById(targetId);
        const targetButton = document.querySelector(`.tab-btn[data-target="${targetId}"]`);
        
        if (targetTab && targetButton) {
            targetTab.classList.add('active');
            targetButton.classList.add('active');
        }
    };

    const setupSearch = (inputElement, items, renderFunction) => {
        inputElement.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filtered = items.filter(item => 
                item.name.toLowerCase().includes(searchTerm)
            );
            renderFunction(filtered);
        });
    };

    const validateCharacter = () => {
        const isValid = character.name.length >= 3 && 
                      character.race && 
                      character.class;
        
        document.querySelectorAll('.next-btn, .finish-btn').forEach(btn => {
            btn.disabled = !isValid;
        });

        return isValid;
    };

    const saveCharacter = () => {
        try {
            const characters = JSON.parse(localStorage.getItem('dndCharacters') || '[]');
            characters.push(character);
            localStorage.setItem('dndCharacters', JSON.stringify(characters));
            alert('¡Personaje guardado con éxito!');
            window.location.href = 'gallery.html';
        } catch (error) {
            console.error('Error saving:', error);
            alert('Error al guardar: ' + error.message);
        }
    };

    init();
});