document.getElementById('createButton').addEventListener('click', function(){
    window.location.href = '/registerBussiness';
});

document.getElementById('loginButton').addEventListener('click', async function(){
    const nombre = document.getElementById('userInput').value;
    const contraseña = document.getElementById('passwordInput').value;

    if(!nombre || !contraseña){
        alert('Por favor, rellene todos los campos');
        return;
    }

    try {
        const response = await fetch('/loginBussiness', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
            },
            body: JSON.stringify ({
                nombre, contraseña
            })
        });

        const result = await response.json();

        if(response.ok){
            alert('Inicio de sesion correcto');
            //window.location.href = '';
        }else{
            alert(result.error || 'Error al intentar iniciar sesion');
        }
    } catch (error) {
        console.error('Error al enviar los datos: ', error);
    }
});