const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const app = express();
const port = 3000;
const cors = require('cors');

app.use(cors());

app.use(express.json());  // Middleware para parsear JSON

// Configurar la carpeta 'public' como directorio estático
app.use(express.static(path.join(__dirname, 'public')));

// Configurar la carpeta 'images' como un directorio estático adicional
app.use('/images', express.static(path.join(__dirname, 'images')));

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

/*
* CREACION DE RUTAS 
*/

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

/*
*   CREACION DE LA BASE DE DATOS
*/

const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'playhub'
});

db.connect((err) => {
    if(err){
        console.error('Error en la conexion de la base de datos: ', err);
        return;
    }
    console.log('Conectado a la base de datos SQL con exito :)');
});

// FUNCION DE CREACION DE CUENTA

const createAccount = (req, res) => {
    const {correo, nombre, contraseña, telefono} = req.body;

    if(!correo || !nombre || !contraseña || !telefono){
        return res.status(400).json({error: 'Todos los campos son obligatorios'});
    }

    db.query('SELECT * FROM usuario WHERE correo = ? OR nombre = ?', [correo, nombre], (err, results) => {
        if(err){
            return res.status(500).json({error: 'Error en la consulta de la base de datos'});
        }

        if(results.length > 0){
            return res.status(500).json({error: 'Usuario ya existente en la base de datos'});
        }

        const query = 'INSERT INTO usuario (correo, nombre, contraseña, telefono, saldo) VALUES (?, ?, ?, ?, ?)';
        db.query(query, [correo, nombre, contraseña, telefono, 0], (err, results) => {
            if(err){
                return res.status(500).json({error: 'Error al crear la cuenta'});
            }
            return res.status(201).json({message: 'Cuenta creada con exito'});
        });
    });
};

// ruta para manejar la creacion de la cuenta

app.post('/register', createAccount);


