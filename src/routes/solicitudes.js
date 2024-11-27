const express = require('express');
const router = express.Router();
const expressJwt = require('express-jwt');
const Solicitud = require('../models/Solicitud');
const Mascota = require('../models/Mascota');
const Usuario = require('../models/Usuario');

// Ruta para obtener todas las solicitudes de una mascota específica
router.get('/mascota/:id_mascota', async (req, res) => {
    try {
        const { id_mascota } = req.params;
        // Encontrar todas las solicitudes para la mascota especificada
        const solicitudes = await Solicitud.findAll({
            where: { id_mascota: id_mascota },
            include: [{ model: Mascota }, { model: Usuario, as: 'potencial_adoptante' }]
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
            const id_potencial_adoptante = req.user.id_usuario; // Obtener el ID del usuario autenticado
            const { id_mascota, estado, razones, tipo_vivienda, otra_mascota, experiencia, descripcion_experiencia, contacto } = req.body;
  
            // Validar los campos requeridos
            if (!id_mascota || !estado || !razones || !tipo_vivienda || !contacto) {
                return res.status(400).json({ error: 'Faltan datos obligatorios para crear la solicitud' });
            }
  
            // Crear la nueva solicitud
            const nuevaSolicitud = await Solicitud.create({
                id_mascota,
                id_potencial_adoptante,
                estado,
                tipo_vivienda,
                otra_mascota,
                experiencia,
                descripcion_experiencia,
                razones,
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

router.get(
    '/usuario/solicitudes',
    expressJwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }),
    async (req, res) => {
        try {
            const id_usuario = req.user.id_usuario; // ID del usuario autenticado
            
            // Consulta con include para traer la relación con Mascota
            const solicitudes = await Solicitud.findAll({
                where: { id_potencial_adoptante: id_usuario },
                include: [
                    {
                        model: Mascota,
                        as: 'mascota' // Usar el alias definido en la asociación
                    }
                ]
            });

            res.json(solicitudes); // Enviar las solicitudes con sus relaciones
        } catch (error) {
            console.error('Error al obtener solicitudes:', error);
            res.status(500).json({ error: 'Error al obtener solicitudes' });
        }
    }
);





module.exports = router;