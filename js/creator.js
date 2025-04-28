import { dndApi } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
    const character = {
        name: '',
        race: null,
        class: null,
        gender: 'other',
        alignment: 'N',
        background: 'acolyte',
        stats: {
            strength: 10,
            dexterity: 10,
            constitution: 10,
            intelligence: 10,
            wisdom: 10,
            charisma: 10
        },
        appearance: {
            height: '',
            weight: '',
            eyes: '',
            skin: '',
            hair: ''
        },
        personality: {
            traits: '',
            ideals: '',
            bonds: '',
            flaws: ''
        }
    };

    const DOM = {
        // Tabs
        characterTab: document.getElementById('characterTab'),
        raceTab: document.getElementById('raceTab'),
        classTab: document.getElementById('classTab'),
        statsTab: document.getElementById('statsTab'),
        personalityTab: document.getElementById('personalityTab'),
        appearanceTab: document.getElementById('appearanceTab'),
        
        // Navigation
        tabButtons: document.querySelectorAll('.tab-btn'),
        prevButtons: document.querySelectorAll('.prev-btn'),
        nextButtons: document.querySelectorAll('.next-btn'),
        
        // Basic Info
        charName: document.getElementById('charName'),
        charGender: document.getElementById('charGender'),
        charAlignment: document.getElementById('charAlignment'),
        charBackground: document.getElementById('charBackground'),
        
        // Race & Class
        raceList: document.getElementById('raceList'),
        classList: document.getElementById('classList'),
        raceSearch: document.getElementById('raceSearch'),
        classSearch: document.getElementById('classSearch'),
        raceDetails: document.getElementById('raceDetails'),
        classDetails: document.getElementById('classDetails'),
        
        // Stats
        statsContainer: document.getElementById('statsContainer'),
        
        // Appearance
        charHeight: document.getElementById('charHeight'),
        charWeight: document.getElementById('charWeight'),
        charEyes: document.getElementById('charEyes'),
        charSkin: document.getElementById('charSkin'),
        charHair: document.getElementById('charHair'),
        
        // Personality
        charTraits: document.getElementById('charTraits'),
        charIdeals: document.getElementById('charIdeals'),
        charBonds: document.getElementById('charBonds'),
        charFlaws: document.getElementById('charFlaws'),
        
        // Preview elements
        previewName: document.getElementById('previewName'),
        previewRace: document.getElementById('previewRace'),
        previewClass: document.getElementById('previewClass'),
        previewStats: document.getElementById('previewStats'),
        charImage: document.getElementById('charImage'),
        
        // Actions
        saveBtn: document.getElementById('saveBtn'),
        finishBtn: document.getElementById('finishBtn')
    };

    const init = async () => {
        await loadRaces();
        await loadClasses();
        setupStats();
        setupEventListeners();
        setupTabNavigation();
        setupSearchFilters();
        initializeBackgroundOptions();
        initializeAlignmentOptions();
    };

    const loadRaces = async () => {
        try {
            const data = await dndApi.getRaces();
            renderRaces(data.results);
        } catch (error) {
            showError(DOM.raceList, error);
        }
    };

    const loadClasses = async () => {
        try {
            const data = await dndApi.getClasses();
            renderClasses(data.results);
        } catch (error) {
            showError(DOM.classList, error);
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

        setupRaceEvents();
    };

    const renderClasses = (classes) => {
        DOM.classList.innerHTML = classes.map(cls => `
            <div class="option-item ${character.class?.index === cls.index ? 'selected' : ''}" 
                 data-class="${cls.index}">
                <h3>${cls.name}</h3>
                <p>Dado de golpe: ${cls.hit_die || '1d8'}</p>
            </div>
        `).join('');

        setupClassEvents();
    };

    const setupRaceEvents = () => {
        document.querySelectorAll('.option-item[data-race]').forEach(item => {
            item.addEventListener('click', async () => {
                document.querySelectorAll('[data-race]').forEach(el => el.classList.remove('selected'));
                item.classList.add('selected');
                
                try {
                    character.race = await dndApi.getRaceDetails(item.dataset.race);
                    
                    // Mostrar detalles de la raza
                    DOM.raceDetails.innerHTML = `
                        <h3>${character.race.name}</h3>
                        <p><strong>Velocidad:</strong> ${character.race.speed}</p>
                        <p><strong>Tamaño:</strong> ${character.race.size}</p>
                        <p><strong>Idiomas:</strong> ${character.race.languages?.map(l => l.name).join(', ') || 'Información no disponible'}</p>
                        <p><strong>Rasgos:</strong> ${character.race.traits?.map(t => t.name).join(', ') || 'Información no disponible'}</p>
                    `;
                    
                    updatePreview();
                } catch (error) {
                    console.error('Error cargando detalles de raza:', error);
                    showError(DOM.raceDetails, error);
                }
            });
        });
    };

    const setupClassEvents = () => {
        document.querySelectorAll('.option-item[data-class]').forEach(item => {
            item.addEventListener('click', async () => {
                document.querySelectorAll('[data-class]').forEach(el => el.classList.remove('selected'));
                item.classList.add('selected');
                
                try {
                    character.class = await dndApi.getClassDetails(item.dataset.class);
                    
                    // Mostrar detalles de la clase
                    DOM.classDetails.innerHTML = `
                        <h3>${character.class.name}</h3>
                        <p><strong>Dado de Golpe:</strong> ${character.class.hit_die}d</p>
                        <p><strong>Competencias:</strong> ${character.class.proficiencies?.map(p => p.name).join(', ') || 'Información no disponible'}</p>
                        <p><strong>Equipamiento:</strong> ${character.class.equipment?.map(e => e.name).join(', ') || 'Información no disponible'}</p>
                    `;
                    
                    updatePreview();
                } catch (error) {
                    console.error('Error cargando detalles de clase:', error);
                    showError(DOM.classDetails, error);
                }
            });
        });
    };

    const setupStats = () => {
        const stats = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
        DOM.statsContainer.innerHTML = stats.map(stat => `
            <div class="stat-item">
                <label for="${stat}">${stat.charAt(0).toUpperCase() + stat.slice(1)}</label>
                <div class="stat-controls">
                    <button type="button" class="stat-btn decrease" data-stat="${stat}">-</button>
                    <div class="stat-circle">
                        <input type="number" id="${stat}" min="8" max="20" value="10" 
                            data-stat="${stat}" 
                            class="stat-input"
                            aria-label="${stat}" readonly>
                    </div>
                    <button type="button" class="stat-btn increase" data-stat="${stat}">+</button>
                </div>
                <div class="stat-modifier">
                    Mod: <span id="${stat}Mod">+0</span>
                </div>
            </div>
        `).join('');

        // Configurar eventos para los botones de estadísticas
        document.querySelectorAll('.stat-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const stat = e.target.dataset.stat;
                const input = document.querySelector(`input[data-stat="${stat}"]`);
                let value = parseInt(input.value);
                
                if (btn.classList.contains('increase') && value < 20) {
                    value++;
                } else if (btn.classList.contains('decrease') && value > 8) {
                    value--;
                }
                
                input.value = value;
                character.stats[stat] = value;
                updateStatModifier(stat, value);
                updatePreview();
            });
        });

        // Inicializar los modificadores
        stats.forEach(stat => {
            updateStatModifier(stat, character.stats[stat]);
        });
    };

    const updateStatModifier = (stat, value) => {
        const modifier = Math.floor((value - 10) / 2);
        const modifierElement = document.getElementById(`${stat}Mod`);
        modifierElement.textContent = modifier >= 0 ? `+${modifier}` : `${modifier}`;
    };

    const updatePreview = () => {
        DOM.previewName.textContent = character.name || 'Nombre del Personaje';
        DOM.previewRace.textContent = character.race?.name || 'Raza no seleccionada';
        DOM.previewClass.textContent = character.class?.name || 'Clase no seleccionada';
        
        // Actualizar vista previa de estadísticas
        if (DOM.previewStats) {
            const statsList = Object.entries(character.stats).map(([stat, value]) => {
                const modifier = Math.floor((value - 10) / 2);
                return `${stat.slice(0, 3).toUpperCase()}: ${value} (${modifier >= 0 ? '+' + modifier : modifier})`;
            }).join(' | ');
            DOM.previewStats.textContent = statsList;
        }

        // Intentar cargar la imagen si existe una raza seleccionada
        if (character.race) {
            // Intentamos usar una imagen basada en el nombre de la raza
            DOM.charImage.src = `assets/images/races/${character.race.index}.png`;
            DOM.charImage.onerror = () => {
                // Si falla, usar imagen por defecto
                DOM.charImage.src = 'assets/images/default-character.png';
            };
        }
        
        validateCharacter();
    };

    const setupEventListeners = () => {
        // Evento para el nombre del personaje
        if (DOM.charName) {
            DOM.charName.addEventListener('input', (e) => {
                character.name = e.target.value.trim();
                updatePreview();
            });
        }

        // Evento para género
        if (DOM.charGender) {
            DOM.charGender.addEventListener('change', (e) => {
                character.gender = e.target.value;
            });
        }

        // Evento para alineamiento
        if (DOM.charAlignment) {
            DOM.charAlignment.addEventListener('change', (e) => {
                character.alignment = e.target.value;
            });
        }

        // Evento para trasfondo
        if (DOM.charBackground) {
            DOM.charBackground.addEventListener('change', (e) => {
                character.background = e.target.value;
            });
        }

        // Eventos para apariencia
        if (DOM.charHeight) DOM.charHeight.addEventListener('input', e => character.appearance.height = e.target.value);
        if (DOM.charWeight) DOM.charWeight.addEventListener('input', e => character.appearance.weight = e.target.value);
        if (DOM.charEyes) DOM.charEyes.addEventListener('input', e => character.appearance.eyes = e.target.value);
        if (DOM.charSkin) DOM.charSkin.addEventListener('input', e => character.appearance.skin = e.target.value);
        if (DOM.charHair) DOM.charHair.addEventListener('input', e => character.appearance.hair = e.target.value);

        // Eventos para personalidad
        if (DOM.charTraits) DOM.charTraits.addEventListener('input', e => character.personality.traits = e.target.value);
        if (DOM.charIdeals) DOM.charIdeals.addEventListener('input', e => character.personality.ideals = e.target.value);
        if (DOM.charBonds) DOM.charBonds.addEventListener('input', e => character.personality.bonds = e.target.value);
        if (DOM.charFlaws) DOM.charFlaws.addEventListener('input', e => character.personality.flaws = e.target.value);

        // Botón de guardar
        if (DOM.saveBtn) {
            DOM.saveBtn.addEventListener('click', () => {
                if (validateCharacter()) saveCharacter();
                else alert('¡Completa todos los campos requeridos!');
            });
        }

        // Botón de finalizar
        if (DOM.finishBtn) {
            DOM.finishBtn.addEventListener('click', () => {
                if (validateCharacter()) saveCharacter();
                else alert('¡Completa todos los campos requeridos!');
            });
        }
    };

    const setupTabNavigation = () => {
        // Botones de navegación de pestañas principales
        DOM.tabButtons.forEach(btn => {
            btn.addEventListener('click', () => switchTab(btn.dataset.target));
        });

        // Botones de anterior/siguiente
        DOM.prevButtons.forEach(btn => {
            btn.addEventListener('click', () => switchTab(btn.dataset.target));
        });

        DOM.nextButtons.forEach(btn => {
            btn.addEventListener('click', () => switchTab(btn.dataset.target));
        });
    };

    const switchTab = (targetId) => {
        // Ocultar todas las pestañas
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Desactivar todos los botones de pestaña
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Mostrar la pestaña seleccionada
        const targetTab = document.getElementById(targetId);
        if (targetTab) targetTab.classList.add('active');
        
        // Activar el botón correspondiente
        const targetBtn = document.querySelector(`.tab-btn[data-target="${targetId}"]`);
        if (targetBtn) targetBtn.classList.add('active');
        
        // Actualizar la barra de progreso si existe
        updateProgressBar(targetId);
    };

    const updateProgressBar = (currentTabId) => {
        const progressBar = document.getElementById('progressBar');
        if (!progressBar) return;
        
        const tabOrder = ['characterTab', 'raceTab', 'classTab', 'statsTab', 'personalityTab', 'appearanceTab'];
        const currentIndex = tabOrder.indexOf(currentTabId);
        
        if (currentIndex !== -1) {
            const progressPercentage = (currentIndex / (tabOrder.length - 1)) * 100;
            progressBar.style.width = `${progressPercentage}%`;
        }
    };

    const setupSearchFilters = () => {
        if (DOM.raceSearch) {
            setupSearch(DOM.raceSearch, DOM.raceList);
        }
        if (DOM.classSearch) {
            setupSearch(DOM.classSearch, DOM.classList);
        }
    };

    const setupSearch = (input, container) => {
        input.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            Array.from(container.children).forEach(item => {
                const text = item.textContent.toLowerCase();
                item.style.display = text.includes(searchTerm) ? 'block' : 'none';
            });
        });
    };

    const initializeBackgroundOptions = () => {
        if (!DOM.charBackground) return;

        const backgrounds = [
            'acolyte', 'charlatan', 'criminal', 'entertainer', 'folk hero',
            'guild artisan', 'hermit', 'noble', 'outlander', 'sage',
            'sailor', 'soldier', 'urchin'
        ];

        DOM.charBackground.innerHTML = backgrounds.map(bg => 
            `<option value="${bg}">${bg.charAt(0).toUpperCase() + bg.slice(1)}</option>`
        ).join('');
    };

    const initializeAlignmentOptions = () => {
        if (!DOM.charAlignment) return;

        const alignments = [
            { value: 'LG', text: 'Legal Bueno' },
            { value: 'NG', text: 'Neutral Bueno' },
            { value: 'CG', text: 'Caótico Bueno' },
            { value: 'LN', text: 'Legal Neutral' },
            { value: 'N', text: 'Neutral' },
            { value: 'CN', text: 'Caótico Neutral' },
            { value: 'LE', text: 'Legal Malvado' },
            { value: 'NE', text: 'Neutral Malvado' },
            { value: 'CE', text: 'Caótico Malvado' }
        ];

        DOM.charAlignment.innerHTML = alignments.map(alignment => 
            `<option value="${alignment.value}">${alignment.text}</option>`
        ).join('');
    };

    const validateCharacter = () => {
        const isValid = character.name.length >= 2 && character.race && character.class;
        
        // Habilitar/deshabilitar botones según la validación
        if (DOM.saveBtn) DOM.saveBtn.disabled = !isValid;
        if (DOM.finishBtn) DOM.finishBtn.disabled = !isValid;
        
        return isValid;
    };

    const saveCharacter = () => {
        try {
            const timestamp = new Date().toISOString();
            const characterToSave = {
                ...character,
                id: generateUniqueId(),
                createdAt: timestamp,
                updatedAt: timestamp
            };
            
            const characters = JSON.parse(localStorage.getItem('dndCharacters')) || [];
            characters.push(characterToSave);
            localStorage.setItem('dndCharacters', JSON.stringify(characters));
            
            alert('¡Personaje guardado con éxito!');
            window.location.href = 'gallery.html';
        } catch (error) {
            console.error('Error guardando:', error);
            alert('Error al guardar: ' + error.message);
        }
    };

    const generateUniqueId = () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    };

    const showError = (container, error) => {
        container.innerHTML = `
            <div class="error">
                <i class="fas fa-exclamation-triangle"></i>
                <p>${error.message || 'Ha ocurrido un error'}</p>
                <button class="retry-btn">Reintentar</button>
            </div>
        `;
        
        const retryBtn = container.querySelector('.retry-btn');
        if (retryBtn) {
            retryBtn.addEventListener('click', async () => {
                if (container === DOM.raceList) await loadRaces();
                else if (container === DOM.classList) await loadClasses();
            });
        }
    };

    // Iniciar la aplicación
    init();
});