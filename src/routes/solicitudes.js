const express = require('express');
const router = express.Router();
const expressJwt = require('express-jwt'); // Asegúrate de importar expressJwt
const Solicitud = require('../models/Solicitud'); // Modelo de Solicitud
const Mascota = require('../models/Mascota'); // Importa el modelo Mascota
const Usuario = require('../models/Usuario'); // Importa el modelo Usuario

// Ruta para obtener todas las solicitudes de una mascota específica
router.get('/mascota/:idMascota', async (req, res) => {
    try {
        const { idMascota } = req.params;
        
        // Encontrar todas las solicitudes para la mascota especificada
        const solicitudes = await Solicitud.findAll({
            where: { id_mascota: idMascota },
            include: [{ model: Mascota }, { model: Usuario, as: 'potencial_adoptante' }] // Incluye datos de la mascota y del adoptante
        });

        res.json(solicitudes);
    } catch (error) {
        console.error('Error al obtener solicitudes:', error);
        res.status(500).json({ error: 'Error al obtener solicitudes' });
    }
});

// Ruta para crear una nueva solicitud de adopción
router.post(
    '/crear',
    expressJwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }),
    async (req, res) => {
      try {
        const id_potencial_adoptante = req.user.id; // Obtener el ID del usuario autenticado
        const { id_mascota, estado, razones, descripcion_hogar, experiencia, contacto } = req.body;
  
        // Validar los campos requeridos
        if (!id_mascota || !estado || !razones || !descripcion_hogar || !contacto) {
          return res.status(400).json({ error: 'Faltan datos obligatorios para crear la solicitud' });
        }
  
        // Crear la nueva solicitud
        const nuevaSolicitud = await Solicitud.create({
          id_mascota,
          id_potencial_adoptante,
          estado,
          razones,
          descripcion_hogar,
          experiencia,
          contacto,
          created: new Date()
        });
  
        res.status(201).json({ message: 'Solicitud creada exitosamente', solicitud: nuevaSolicitud });
      } catch (error) {
        console.error('Error al crear la solicitud:', error);
        res.status(500).json({ error: 'Error al crear la solicitud' });
      }
    }
  );

module.exports = router;
