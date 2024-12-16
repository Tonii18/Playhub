// Obtener los elementos necesarios
const menuBtn = document.getElementById('menu-button');
const dropdownPanel = document.getElementById('dropdown-panel');

// Función para abrir/cerrar el menú
menuBtn.addEventListener('click', () => {
    dropdownPanel.classList.toggle('open');
});

// Función para cerrar el menú si se hace clic fuera de él
document.addEventListener('click', (event) => {
    if (!dropdownPanel.contains(event.target) && event.target !== menuBtn) {
        dropdownPanel.classList.remove('open');
    }
});

// Elementos del DOM para el popup
const logoutPopup = document.getElementById('logout-popup');
const logoutButton = document.getElementById('logout-button'); // Botón del menú desplegable
const confirmLogout = document.getElementById('confirm-logout');
const cancelLogout = document.getElementById('cancel-logout');

// Abrir el popup
logoutButton.addEventListener('click', () => {
    logoutPopup.style.display = 'flex';
});

// Cerrar sesión (confirmación)
confirmLogout.addEventListener('click', () => {
    // Aquí puedes añadir la lógica para cerrar sesión, como redirigir al inicio de sesión
    window.location.href = '/login'; // Redirigir a la página de inicio de sesión
});

// Cancelar el cierre de sesión
cancelLogout.addEventListener('click', () => {
    logoutPopup.style.display = 'none';
});

// Cerrar el popup al hacer clic fuera de él
logoutPopup.addEventListener('click', (e) => {
    if (e.target === logoutPopup) {
        logoutPopup.style.display = 'none';
    }
});


/*
* LOGICA PARA EL BOTON DE VER PERFIL
*/

const profileBtn = document.getElementById('profile-button');
profileBtn.addEventListener('click', () => {
    window.location.href = '/owner-profile';
});