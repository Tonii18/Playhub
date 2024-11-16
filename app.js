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

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/loginBussiness', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'loginBussiness.html'));
});

app.get('/registerBussiness', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'registerBussiness.html'));
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

/*
* FUNCIONES
*/

// Funcion de crear cuenta de 'Usuario'

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

// Funcion de inicio de sesion de 'Usuario'

const loginUser = (req, res) => {
    const {nombre, contraseña} = req.body;

    if(!nombre || !contraseña){
        return res.status(400).json({error: 'Todos los campos son obligatorios'});
    }

    const query = "SELECT * FROM usuario WHERE nombre = ? AND contraseña = ?";
    db.query(query, [nombre, contraseña], (err, results) => {
        if(err){
            return res.status(500).json({error: 'Error en la consulta de la base de datos'});
        }

        if(results.length === 0){
            return res.status(401).json({error: 'Usuario no existente'});
        }

        return res.status(200).json({message: 'Inicio de sesion exitoso'});
    });
};

// Funcion de crear cuenta de 'Propietario'

const createBussinessAccount = (req, res) => {
    const {correo, nombre, apellidos, contraseña, telefono} = req.body;

    if(!correo || !nombre || !apellidos || !contraseña || !telefono){
        return res.status(400).json({error: 'Todos los campos del propietario son obligatorios'});
    }

    const {nombre_negocio, correo_negocio, ubicacion, telefono_negocio} = req.body;

    if(!nombre_negocio || !correo_negocio || !ubicacion || !telefono_negocio){
        return res.status(400).json({error: 'Todos los campos del negocio son obligatorios'});
    }

    const ownerExist = 'SELECT * FROM propietario WHERE correo = ?';
    const bussinessExist = 'SELECT * FROM negocios WHERE propietario_id = ?';
    const insertBussiness = 'INSERT INTO negocios (nombre_negocio, correo_negocio, ubicacion, telefono_negocio, ingresos, propietario_id) VALUES (?, ?, ?, ?, ?, ?)';
    const insertOwner = 'INSERT INTO propietario (nombre, apellidos, correo, contraseña, telefono) VALUES (?, ?, ?, ?, ?)';
    // Verificar si el propietario ya existe
    db.query(ownerExist, [correo], (err, propietariosResults) => {
        if(err){
            return res.status(500).json({error: 'Error en la consulta de la base de datos'});
        }

        if(propietariosResults.length > 0){
            // Si el propietario existe, verificar si ya tiene un negocio
            const propietarioId = propietariosResults[0].id;
            db.query(bussinessExist, [propietarioId], (err, negociosResults) => {
                if(err){
                    return res.status(500).json({error: 'Error en la consulta de la base de datos'});
                }

                if(negociosResults.length > 0){
                    return res.status(400).json({error: 'El propietario ya tiene un negocio'});
                }

                // Si no tiene un negocio, registramos el nuevo negocio
                db.query(insertBussiness, [nombre_negocio, correo_negocio, ubicacion, telefono_negocio, 0, propietarioId], (err, results) => {
                    if(err){
                        return res.status(400).json({error: 'Error al conectar la base de datos'});
                    }
                    return res.status(201).json({message: 'Negocio registrado correctamente'});
                });
            });
        }else{
            // Si el propietario no existe, lo creamos y luego registramos el negocio
            db.query(insertOwner, [nombre, apellidos, correo, contraseña, telefono], (err, propietariosInsertResults) => {
                if(err){
                    return res.status(500).json({error: 'Error al registrar el propietario'});
                }

                const propietarioId = propietariosInsertResults.insertId;

                // Ahora registramos el negocio
                db.query(insertBussiness, [nombre_negocio, correo_negocio, ubicacion, telefono_negocio, ingresos, propietarioId], (err, negociosResults) => {
                    if(err){
                        return res.status(500).json({error: 'Error al registrar el negocio'});
                    }
                    return res.status(201).json({message: 'Negocio registrado correctamente'});
                });
            });
        }
    });
};

// Funcion de inicio de sesion de Propietario

const loginOwnerBussiness = (req, res) => {
    const {nombre, contraseña} = req.body;

    if(!nombre || !contraseña){
        return res.status(400).json({error: 'Todos los campos son obligatorios'});
    }

    const getOwner = 'SELECT * FROM propietario WHERE nombre = ? AND contraseña = ?';

    db.query(getOwner, [nombre, contraseña], (err, propietarioResults) => {
        if(err){
            return res.status(500).json({error: 'Error en la consulta de la base de datos'});
        }

        if(propietarioResults.length === 0){
            return res.status(401).json({error: 'Usuario o contraseña incorrectos'});
        }

        return res.status(200).json({message: 'Sesion iniciada correctamente'});
    });
};

// ruta para manejar la creacion de la cuenta

app.post('/register', createAccount);
app.post('/login', loginUser);
app.post('/registerBussiness', createBussinessAccount);
app.post('/loginBussiness', loginOwnerBussiness);


