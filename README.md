# D&D Character Creator

![D&D Character Creator]

## Descripción

D&D Character Creator es una aplicación web interactiva y visualmente atractiva que permite a los usuarios crear y personalizar personajes para el mundo de Dungeons & Dragons. Esta plataforma ha sido desarrollada para GameCampus como parte de su nuevo videojuego de fantasía épica, permitiendo a los jugadores experimentar con diferentes razas, clases y habilidades antes de sumergirse en el mundo del juego.

## Características

- **Creación completa de personajes** con opciones de personalización detalladas
- **Sistema de filtrado** para razas, clases y habilidades
- **Estadísticas personalizadas** con modificadores según las reglas de D&D 5ª edición
- **Guardado local** de personajes para acceder a ellos posteriormente
- **Galería de personajes** para visualizar y gestionar tus creaciones
- **Diseño responsivo** compatible con dispositivos móviles, tablets y escritorio
- **Interfaz intuitiva** con sistema de pestañas y navegación guiada

## Tecnologías utilizadas

- HTML5
- CSS3 (con Flexbox y Grid para layouts responsivos)
- JavaScript (ES6+)
- API de D&D 5e
- LocalStorage para persistencia de datos

## Estructura del proyecto

```
/
├── assets/
│   ├── images/
│   │   ├── races/
│   │   ├── classes/
│   │   ├── backgrounds/
│   │   └── icons/
│   └── fonts/
├── styles/
│   ├── main.css
│   ├── character.css
│   ├── gallery.css
│   └── landing.css
├── scripts/
│   ├── api.js
│   ├── character.js
│   ├── gallery.js
│   └── landing.js
├── index.html
├── character.html
├── gallery.html
└── README.md
```

## Instalación y configuración

1. **Clonar el repositorio**

```bash
git clone https://github.com/your-username/dnd-character-creator.git
cd dnd-character-creator
```

2. **Configuración de la API**

La aplicación utiliza la API pública de D&D 5e. No se requiere ninguna clave API o configuración especial para acceder a esta API.

3. **Ejecución**

Al ser una aplicación web basada en HTML/CSS/JavaScript, simplemente abre los archivos HTML en tu navegador favorito o utiliza un servidor web local como Live Server para VS Code.

```bash
# Si tienes Python instalado, puedes usar un servidor simple
python -m http.server 8000
```

Luego, abre tu navegador y visita "https://jerssonfuentes.github.io/calabozos-dragones"

## Guía de uso

### Página de inicio

La página de inicio proporciona una breve introducción al creador de personajes y sus características principales. Desde aquí, puedes:

- Acceder al creador de personajes
- Ver la galería de personajes guardados
- Aprender más sobre las características del creador

### Creador de personajes

El proceso de creación de personajes está dividido en varias pestañas que te guiarán paso a paso:

1. **Información básica**: Nombre, género, alineamiento y trasfondo
2. **Selección de raza**: Explora las diferentes razas disponibles en D&D
3. **Selección de clase**: Elige una clase que defina las habilidades de tu personaje
4. **Estadísticas**: Personaliza las estadísticas básicas (fuerza, destreza, constitución, etc.)
5. **Personalidad**: Define rasgos de personalidad, ideales, vínculos y defectos
6. **Apariencia**: Describe el aspecto físico de tu personaje

Una vista previa del personaje se muestra en todo momento, actualizándose a medida que realizas cambios.

### Galería de personajes

La galería te permite:

- Ver todos tus personajes guardados
- Buscar y filtrar personajes por nombre, raza o clase
- Editar personajes existentes
- Eliminar personajes
- Ver detalles completos de cada personaje

## Compatibilidad

La aplicación ha sido probada y es compatible con:

- Google Chrome (v88+)
- Mozilla Firefox (v85+)
- Microsoft Edge (v88+)
- Safari (v14+)
- Chrome para Android
- Safari para iOS


## Contribución

Las contribuciones son bienvenidas. Para contribuir:

1. Haz un fork del repositorio
2. Crea una rama para tu característica (`git checkout -b feature/nueva-caracteristica`)
3. Realiza tus cambios y haz commit (`git commit -am 'Añadir nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Crea un Pull Request

## Créditos

- Datos de D&D proporcionados por [D&D 5e API](https://www.dnd5eapi.co/)
- Iconos creados por [FontAwesome](https://fontawesome.com/)
- Imágenes de ejemplo propiedad de GameCampus

