const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        const esPasswordCorrecta = await bcrypt.compare(password, usuario.password);
        if (!esPasswordCorrecta) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, nombre: usuario.nombre });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

module.exports = router;
