import { dndApi } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
    const state = {
        character: {
            name: '',
            race: null,
            class: null,
            stats: { strength: 10, dexterity: 10, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10 }
        },
        DOM: {
            charName: document.getElementById('charName'),
            raceList: document.getElementById('raceList'),
            classList: document.getElementById('classList'),
            previewName: document.getElementById('previewName'),
            previewRace: document.getElementById('previewRace'),
            previewClass: document.getElementById('previewClass'),
            saveBtn: document.getElementById('saveBtn'),
            statsContainer: document.getElementById('statsContainer')
        }
    };

    // Cargar datos iniciales
    const loadData = async () => {
        try {
            const [races, classes] = await Promise.all([
                dndApi.getRaces(),
                dndApi.getClasses()
            ]);
            
            renderOptions(races.results, state.DOM.raceList, 'race');
            renderOptions(classes.results, state.DOM.classList, 'class');
            setupStats();
            setupEventListeners();
        } catch (error) {
            showError(error.message);
        }
    };

    // Renderizar opciones
    const renderOptions = (items, container, type) => {
        container.innerHTML = items.map(item => `
            <div class="option-item" data-${type}="${item.index}">
                <h3>${item.name}</h3>
                <p>${type === 'race' ? item.alignment || 'Alineamiento variado' : `Dado: ${item.hit_die}`}</p>
            </div>
        `).join('');

        container.querySelectorAll('.option-item').forEach(item => {
            item.addEventListener('click', async () => handleSelection(item, type));
        });
    };

    // Manejar selección
    const handleSelection = async (element, type) => {
        const index = element.dataset[type];
        try {
            const details = await dndApi[`get${type.charAt(0).toUpperCase() + type.slice(1)}Details`](index);
            state.character[type] = details;
            element.parentElement.querySelectorAll('.option-item').forEach(i => i.classList.remove('selected'));
            element.classList.add('selected');
            updatePreview();
        } catch (error) {
            showError(error.message);
        }
    };

    // Configurar estadísticas
    const setupStats = () => {
        state.DOM.statsContainer.innerHTML = Object.keys(state.character.stats).map(stat => `
            <div class="stat-item">
                <label>${stat.slice(0, 3).toUpperCase()}</label>
                <div class="stat-controls">
                    <button class="stat-btn decrease" data-stat="${stat}">-</button>
                    <span class="stat-value">${state.character.stats[stat]}</span>
                    <button class="stat-btn increase" data-stat="${stat}">+</button>
                </div>
            </div>
        `).join('');

        document.querySelectorAll('.stat-btn').forEach(btn => {
            btn.addEventListener('click', (e) => adjustStat(e.target));
        });
    };

    // Ajustar estadísticas
    const adjustStat = (button) => {
        const stat = button.dataset.stat;
        const isIncrease = button.classList.contains('increase');
        const currentValue = state.character.stats[stat];
        
        if ((isIncrease && currentValue < 20) || (!isIncrease && currentValue > 8)) {
            state.character.stats[stat] += isIncrease ? 1 : -1;
            button.parentElement.querySelector('.stat-value').textContent = state.character.stats[stat];
        }
    };

    // Actualizar vista previa
    const updatePreview = () => {
        state.DOM.previewName.textContent = state.character.name || 'Sin nombre';
        state.DOM.previewRace.textContent = state.character.race?.name || 'No seleccionada';
        state.DOM.previewClass.textContent = state.character.class?.name || 'No seleccionada';
    };

    // Configurar eventos
    const setupEventListeners = () => {
        state.DOM.charName.addEventListener('input', (e) => {
            state.character.name = e.target.value;
            updatePreview();
        });

        state.DOM.saveBtn.addEventListener('click', () => {
            if (validateCharacter()) {
                saveCharacter();
            } else {
                alert('¡Selecciona una raza y una clase!');
            }
        });
    };

    // Validar personaje
    const validateCharacter = () => {
        return state.character.name.trim() && state.character.race && state.character.class;
    };

    // Guardar personaje
    const saveCharacter = () => {
        const characters = JSON.parse(localStorage.getItem('dndCharacters')) || [];
        characters.push({
            ...state.character,
            id: Date.now().toString(36),
            created: new Date().toISOString()
        });
        localStorage.setItem('dndCharacters', JSON.stringify(characters));
        alert('Personaje guardado exitosamente!');
    };

    // Mostrar errores
    const showError = (message) => {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            ${message}
            <button onclick="location.reload()">Reintentar</button>
        `;
        document.querySelector('.app-container').prepend(errorDiv);
    };

    // Iniciar
    loadData();
});