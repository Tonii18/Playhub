const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Configurar la carpeta 'public' como directorio estático
app.use(express.static(path.join(__dirname, 'public')));

// Configurar la carpeta 'images' como un directorio estático adicional
app.use('/images', express.static(path.join(__dirname, 'images')));

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});


