// ENVIAR DATOS DEL FORMULARIO A LA BASE DE DATOS

document.getElementById('register').addEventListener('click', async function () {
    const correo = document.getElementById('correoInput').value;
    const nombre = document.getElementById('nombreInput').value;
    const apellidos = document.getElementById('apellidosInput').value;
    const contraseña = document.getElementById('contraseñaInput').value;
    const telefono = document.getElementById('telefonoInput').value;

    if(!correo || !nombre || !apellidos || !contraseña || !telefono){
        alert('Por favor, rellene todos los campos');
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
            })
        });

        const result = await response.json();

        if(response.ok){
            // Redirigir al usuario a otra pagina
            window.location.href = '/owner-mainpage'
        }else{
            alert(result.error || 'Error al crear la cuenta');
        }
    } catch (error) {
        console.error('Error al enviar los datos: ', error);
    }
});