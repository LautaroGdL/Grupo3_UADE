// Obtén el botón y el menú
const toggleMenu = document.getElementById('toggle-menu');
const navbar = document.getElementById('navbar');

// Agrega un evento de clic al botón
toggleMenu.addEventListener('click', function() {
    // Si el menú está visible, ocúltalo; si está oculto, muéstralo
    navbar.style.display = navbar.style.display === 'none' ? 'block' : 'none';
});