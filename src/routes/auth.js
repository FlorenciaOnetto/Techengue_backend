const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const Usuario = require('../models/Usuario');
const router = express.Router();

// Ruta para obtener los datos del usuario autenticado
router.get('/profile', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: 'Token no proporcionado' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const usuario = await Usuario.findByPk(decoded.id_usuario, {
            attributes: ['id_usuario', 'nombre', 'email']
        });

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(usuario);
    } catch (error) {
        console.error("Error al obtener perfil:", error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Ruta de registro
router.post('/register', async (req, res) => {
    const { email, password, nombre } = req.body;

    try {
        const usuarioExistente = await Usuario.findOne({ where: { email } });
        if (usuarioExistente) {
            return res.status(400).json({ error: 'Usuario ya registrado' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await Usuario.create({ nombre, email, password: hashedPassword });

        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Ruta de inicio de sesión
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

        const token = jwt.sign({ id_usuario: usuario.id_usuario }, process.env.JWT_SECRET, { expiresIn: '1h' });
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
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const usuario = await Usuario.findByPk(decoded.id_usuario);
        
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        usuario.nombre = nombre;
        usuario.email = email;
        await usuario.save();

        res.json({ message: 'Perfil actualizado exitosamente', usuario });
    } catch (error) {
        console.error("Error al actualizar perfil:", error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Ruta para eliminar el usuario
router.delete('/profile', expressJwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }), async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.user.id_usuario); 

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        await usuario.destroy();
        res.status(204).send();
    } catch (error) {
        console.error("Error al eliminar el usuario:", error.message);
        res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
});

module.exports = router;
