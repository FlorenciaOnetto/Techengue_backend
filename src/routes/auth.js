const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const Usuario = require('../models/Usuario');
const router = express.Router();

// Ruta para obtener los datos del usuario autenticado
router.get('/profile', async (req, res) => {
    try {
        // Obtener el token del encabezado de la solicitud
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: 'Token no proporcionado' });
        }

        // Verificar y decodificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const usuario = await Usuario.findByPk(decoded.id, {
            attributes: ['id', 'nombre', 'email'] // Aquí puedes agregar otros atributos si necesitas
        });

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(usuario);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Ruta de registro (sin autenticación)
router.post('/register', async (req, res) => {
    const { email, password, nombre } = req.body;

    try {
        const usuarioExistente = await Usuario.findOne({ where: { email } });
        if (usuarioExistente) {
            return res.status(400).json({ error: 'Usuario ya registrado' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const nuevoUsuario = await Usuario.create({ nombre, email, password: hashedPassword });

        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Ruta de inicio de sesión (sin autenticación)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario) {
            console.log("Usuario no encontrado:", email);
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        const esPasswordCorrecta = await bcrypt.compare(password, usuario.password);
        if (!esPasswordCorrecta) {
            console.log("Contraseña incorrecta para el usuario:", email);
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, nombre: usuario.nombre });
    } catch (error) {
        console.error("Error en la ruta de login:", error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});


// Ruta para actualizar los datos del usuario
router.put('/profile', async (req, res) => {
    const { nombre, email } = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    try {
        const usuario = await Usuario.findByPk(decoded.id);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        usuario.nombre = nombre;
        usuario.email = email;
        await usuario.save();

        res.json({ message: 'Perfil actualizado exitosamente', usuario });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Ruta para eliminar el usuario
router.delete('/profile', expressJwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }), async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.user.id); // req.user.id proviene del token

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        await usuario.destroy(); // Elimina el usuario
        res.status(204).send(); // Envío de respuesta vacía
    } catch (error) {
        console.error("Error al eliminar el usuario:", error.message);
        res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
});



module.exports = router;
