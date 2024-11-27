// Escuchar el clic en el botón de registro
document.getElementById('createButton').addEventListener('click', async function () {
    const correo = document.getElementById('correo').value;
    const nombre = document.getElementById('nombre').value;
    const contraseña = document.getElementById('contraseña').value;
    const telefono = document.getElementById('telefono').value;

    // Comprobar que todos los campos estén rellenos
    if (!correo || !nombre || !contraseña || !telefono) {
        alert('Por favor, rellene todos los campos');
        return;
    }

    try {
        // Enviar los datos al servidor usando Fetch
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                correo,
                nombre,
                contraseña,
                telefono
            }),
            credentials: 'include', // Incluye cookies para la sesión
        });

        // Leer la respuesta del servidor
        const result = await response.json();

        if (response.ok) {
            // Redirigir al perfil después del registro
            window.location.href = '/mainmenu';
        } else {
            // Mostrar el mensaje de error del servidor
            alert(result.error || 'Error al crear la cuenta');
        }
    } catch (error) {
        console.error('Error al enviar los datos:', error);
        alert('Ocurrió un error al procesar tu solicitud. Intenta nuevamente más tarde.');
    }
});
