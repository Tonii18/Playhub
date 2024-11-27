console.log('Cargado correctamente');

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Hacer la solicitud a /api/profile
        const response = await fetch('/api/profile', {
            method: 'GET',
            credentials: 'include' // Para incluir cookies en la solicitud
        });

        // Depuración: Mostrar el estado de la respuesta
        console.log('Estado de la respuesta:', response.status);

        // Verificar si la solicitud fue exitosa
        if (response.ok) {
            // Analizar la respuesta como JSON
            const userData = await response.json();

            // Depuración: Mostrar los datos obtenidos
            console.log('Datos del usuario:', userData);

            // Actualizar los elementos del DOM con los datos del usuario
            document.getElementById('username').textContent = userData.nombre || 'N/A';
            document.getElementById('email').textContent = userData.correo || 'N/A';
            document.getElementById('phone').textContent = userData.telefono || 'N/A';
            document.getElementById('balance').textContent = `${userData.saldo || 0} €`;
        } else {
            // Mostrar un mensaje de error y redirigir al inicio
            console.error('Error en la respuesta del servidor:', response.statusText);
            alert('No se pudo cargar el perfil. Por favor, inicia sesión nuevamente.');
            window.location.href = '/'; // Redirigir al inicio de sesión
        }
    } catch (error) {
        // Manejar errores de la solicitud
        console.error('Error al obtener los datos del perfil:', error);
        alert('Hubo un problema al conectar con el servidor. Inténtalo más tarde.');
    }
});

