const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql2');
const app = express();
const port = 3000;
const cors = require('cors');

app.use(cors());
app.use(express.json());  // Middleware para parsear JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configurar la carpeta 'public' como directorio estático
app.use(express.static(path.join(__dirname, 'public')));

// Configurar la carpeta 'images' como un directorio estático adicional
app.use('/images', express.static(path.join(__dirname, 'images')));

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

//1. Configuracion de la sesion
app.use(session({
    secret: 'mi_clave_secreta', // Cambia esto por algo más seguro
    resave: false,
    saveUninitialized: true,
}));



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

app.get('/mainmenu', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'mainPage.html'));
});

app.get('/profile', (req, res) =>{
    res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

app.get('/sport-searching', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sportSearching.html'));
});

app.get('/owner-mainpage', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'ownerMainPage.html'));
});

app.get('/owner-profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'ownerProfile.html'));
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
    const { correo, nombre, contraseña, telefono } = req.body;

    if (!correo || !nombre || !contraseña || !telefono) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    db.query('SELECT * FROM usuario WHERE correo = ? OR nombre = ?', [correo, nombre], (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.status(500).json({ error: 'Error en la consulta de la base de datos' });
        }

        if (results.length > 0) {
            return res.status(409).json({ error: 'Correo o nombre de usuario ya en uso' });
        }

        const query = 'INSERT INTO usuario (correo, nombre, contraseña, telefono, saldo) VALUES (?, ?, ?, ?, ?)';
        db.query(query, [correo, nombre, contraseña, telefono, 0], (err, insertResults) => {
            if (err) {
                console.error('Error al crear el usuario:', err);
                return res.status(500).json({ error: 'Error al crear la cuenta' });
            }

            // Iniciar sesión automáticamente
            const user = { id: insertResults.insertId, correo, nombre, telefono, saldo: 0 };
            req.session.user = user;

            return res.status(201).json({
                message: 'Cuenta creada con éxito',
                user, // Devolver los datos del usuario si necesitas usarlos en frontend
            });
        });
    });
};

// Funcion de inicio de sesion de 'Usuario'
const loginUser = (req, res) => {
    const { nombre, contraseña } = req.body;

    if (!nombre || !contraseña) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const query = "SELECT * FROM usuario WHERE nombre = ? AND contraseña = ?";
    db.query(query, [nombre, contraseña], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error en la consulta de la base de datos' });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: 'Usuario no existente' });
        }

        // Guardar los datos del usuario en la sesión
        req.session.user = results[0];
        return res.status(200).json({ message: 'Inicio de sesión exitoso' });
    });
};           

// Funcion de crear cuenta de 'Propietario'
const createBussinessAccount = (req, res) => {
    const { correo, nombre, apellidos, contraseña, telefono } = req.body;

    // Validación de los campos obligatorios
    if (!correo || !nombre || !apellidos || !contraseña || !telefono) {
        return res.status(400).json({ error: 'Todos los campos del propietario son obligatorios' });
    }

    const ownerExist = 'SELECT * FROM propietario WHERE correo = ?';
    const insertOwner = 'INSERT INTO propietario (nombre, apellidos, correo, contraseña, telefono, ingreso) VALUES (?, ?, ?, ?, ?, ?)';

    // Verificar si el propietario ya está registrado
    db.query(ownerExist, [correo], (err, propietariosResults) => {
        if (err) {
            console.error('Error en la consulta de la base de datos:', err);
            return res.status(500).json({ error: 'Error en la consulta de la base de datos' });
        }

        if (propietariosResults.length > 0) {
            return res.status(400).json({ error: 'El propietario ya está registrado' });
        }

        // Registrar al nuevo propietario
        db.query(insertOwner, [nombre, apellidos, correo, contraseña, telefono, 0], (err, propietariosInsertResults) => {
            if (err) {
                console.error('Error al registrar el propietario:', err);
                return res.status(500).json({ error: 'Error al registrar el propietario' });
            }

            // Crear sesión automáticamente para el propietario registrado
            const propietario = {
                id: propietariosInsertResults.insertId,
                correo,
                nombre,
                apellidos,
                telefono,
                ingreso: 0,
            };

            req.session.propietario = propietario;

            // Devolver respuesta con los datos del propietario
            return res.status(201).json({
                message: 'Propietario registrado correctamente',
                propietario, // Enviar los datos del propietario si son necesarios en frontend
            });
        });
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

        req.session.propietario = propietarioResults[0];
        return res.status(200).json({message: 'Sesion iniciada correctamente'});
    });
};

// Ruta para obtener el perfil
const getProfile = (req, res) => {
    console.log(req.session); // Revisa si la sesión contiene los datos esperados
    if (!req.session.user) {
        return res.status(401).json({ error: 'No has iniciado sesión' });
    }

    const { nombre, correo, telefono, saldo } = req.session.user;
    res.json({ nombre, correo, telefono, saldo });
};

// Ruta para obtener el perfil del propietario
const getOwnerProfile = (req, res) => {
    console.log(req.session); // Revisa si la sesión contiene los datos esperados
    if (!req.session.propietario) {
        return res.status(401).json({ error: 'No has iniciado sesión' });
    }

    const { nombre, correo, telefono, ingreso } = req.session.propietario;
    res.json({ nombre, correo, telefono, ingreso });
}



app.post('/register', createAccount);
app.post('/login', loginUser);
app.post('/registerBussiness', createBussinessAccount);
app.post('/loginBussiness', loginOwnerBussiness);
app.get('/api/profile', getProfile);
app.get('/api/owner-profile', getOwnerProfile);


