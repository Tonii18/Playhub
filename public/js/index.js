document.getElementById('createButton').addEventListener('click', function(){
    window.location.href = "/register";
});

document.getElementById('bussinessButton').addEventListener('click', function(){
    window.location.href = "/loginBussiness";
});

document.getElementById('loginButton').addEventListener('click', async function() {
    const nombre = document.getElementById('userInput').value;
    const contraseña = document.getElementById('passwordInput').value;

    if(!nombre || !contraseña){
        alert('Por favor, rellene todos los campos');
        return;
    }

    try {
        const response = await fetch('/login', {
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
            window.location.href = '/mainmenu';
        }else{
            alert(result.error || 'Error al crear la cuenta');
        }
    } catch (error) {
        console.error('Error al enviar los datos: ', error)
    }
});

