// ENVIAR DATOS DEL FORMULARIO A LA BASE DE DATOS

document.getElementById('register').addEventListener('click', async function () {
    const correo = document.getElementById('correoInput').value;
    const nombre = document.getElementById('nombreInput').value;
    const apellidos = document.getElementById('apellidosInput').value;
    const contraseña = document.getElementById('contraseñaInput').value;
    const telefono = document.getElementById('telefonoInput').value;

    const nombre_negocio = document.getElementById('nombreNegocioInput').value;
    const correo_negocio = document.getElementById('correoNegocioInput').value;
    const ubicacion = document.getElementById('ubicacionInput').value;
    const telefono_negocio = document.getElementById('telefonoNegocioInput').value;

    if(!correo || !nombre || !apellidos || !contraseña || !telefono){
        alert('Por favor, rellene todos los campos');
        return;
    }

    if(!nombre_negocio || !correo_negocio || !ubicacion || !telefono_negocio){
        alert('Por favor rellene todos los campos');
        return;
    }

    // Enviar los datos al servidor con Fetch

    try {
        const response = await fetch('/registerBussiness', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
            },
            body: JSON.stringify({
                nombre, apellidos, correo, contraseña, telefono,
                nombre_negocio, correo_negocio, ubicacion, telefono_negocio
            })
        });

        const result = await response.json();

        if(response.ok){
            alert('Negocio creado exitosamente');
            // Redirigir al usuario a otra pagina
            //window.location.href = 
        }else{
            alert(result.error || 'Error al crear la cuenta');
        }
    } catch (error) {
        console.error('Error al enviar los datos: ', error);
    }
});