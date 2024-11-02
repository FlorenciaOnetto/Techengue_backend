const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario'); // Asegúrate de que la ruta al modelo sea correcta

const router = express.Router();

// Ruta de registro
router.post('/register', async (req, res) => {
  const { email, password, nombre } = req.body;

  try {
    // Verifica si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'Usuario ya registrado' });
    }

    // Crea el nuevo usuario
    const hashedPassword = await bcrypt.hash(password, 10);
    const nuevoUsuario = await Usuario.create({ nombre, email, password: hashedPassword });

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Ruta de inicio de sesión
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Busca al usuario en la base de datos por el correo electrónico
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Compara la contraseña proporcionada con la contraseña almacenada
    const esPasswordCorrecta = await bcrypt.compare(password, usuario.password);
    if (!esPasswordCorrecta) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Genera un token JWT y envía el nombre junto con el token
    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, nombre: usuario.nombre }); // Incluye el nombre en la respuesta
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = router;
