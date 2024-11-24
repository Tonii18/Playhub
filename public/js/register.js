// ENVIAR DATOS DEL FORMULARIO A LA BASE DE DATOS

document.getElementById('createButton').addEventListener('click', async function() {
    const correo = document.getElementById('correo').value;
    const nombre = document.getElementById('nombre').value;
    const contraseña = document.getElementById('contraseña').value;
    const telefono = document.getElementById('telefono').value;

    // Comprobar que todos los campos esten rellenos

    if(!correo || !nombre || !contraseña || !telefono){
        alert('Por favor, rellene todos los campos');
        return;
    }

    // Enviar los datos al servidor con Fetch

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
            },
            body: JSON.stringify({
                correo, nombre, contraseña, telefono
            })
        });

        const result = await response.json();

        if(response.ok){
            alert('Cuenta creada existosamente');
            // Redirigir al usuario a otra pagina
            window.location.href = '/mainMenu';
        }else{
            alert(result.error || 'Error al crear la cuenta');
        }
    } catch (error) {
        console.error('Error al enviar los datos: ', error);
    }

});