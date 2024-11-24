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

