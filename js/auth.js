// Simulación de base de datos de usuarios
let users = JSON.parse(localStorage.getItem('dnd_users')) || [
    { username: 'admin', email: 'admin@example.com', password: 'admin123' }
];

// Elementos del DOM
const loginTab = document.getElementById('loginTab');
const registerTab = document.getElementById('registerTab');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const logoutBtn = document.getElementById('logoutBtn');

// Cambiar entre pestañas
if (loginTab && registerTab) {
    loginTab.addEventListener('click', () => {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
    });

    registerTab.addEventListener('click', () => {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
    });
}

// Manejar login
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = 'home.html';
        } else {
            alert('Usuario o contraseña incorrectos');
        }
    });
}

// Manejar registro
if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('regUsername').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        
        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }
        
        if (users.some(u => u.username === username)) {
            alert('El usuario ya existe');
            return;
        }
        
        const newUser = { username, email, password };
        users.push(newUser);
        localStorage.setItem('dnd_users', JSON.stringify(users));
        
        alert('Registro exitoso. Ahora puedes iniciar sesión.');
        loginTab.click();
    });
}

// Manejar logout
if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
        sessionStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
}

// Verificar sesión al cargar páginas protegidas
document.addEventListener('DOMContentLoaded', function() {
    if (!window.location.pathname.includes('index.html')) {
        const currentUser = sessionStorage.getItem('currentUser');
        if (!currentUser) {
            window.location.href = 'index.html';
        }
    }
});