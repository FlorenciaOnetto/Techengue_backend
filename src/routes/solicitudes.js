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
            include: [
                { model: Mascota, as: 'mascota' },
                { model: Usuario, as: 'potencial_adoptante' }
            ]
        });

        res.json(solicitudes);
    } catch (error) {
        console.error('Error al obtener solicitudes:', error);
        res.status(500).json({ error: 'Error al obtener solicitudes' });
    }
});

// Ruta para crear una nueva solicitud de adopción
// Ruta para crear una nueva solicitud de adopción
router.post(
    '/crear',
    expressJwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }),
    async (req, res) => {
        try {
            const id_potencial_adoptante = req.user.id_usuario; // ID del usuario autenticado
            const { id_mascota, estado, razones, tipo_vivienda, otra_mascota, experiencia, descripcion_experiencia, contacto } = req.body;

            // Validar los campos requeridos
            if (!id_mascota || !estado || !razones || !tipo_vivienda || !contacto) {
                return res.status(400).json({ error: 'Faltan datos obligatorios para crear la solicitud' });
            }

            // Verificar si ya existe una solicitud para esta mascota y usuario
            const solicitudExistente = await Solicitud.findOne({
                where: {
                    id_mascota,
                    id_potencial_adoptante
                }
            });

            if (solicitudExistente) {
                return res.status(400).json({ error: 'Ya has enviado una solicitud para esta mascota' });
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



// Ruta para actualizar el estado de una solicitud
router.put('/:id_solicitud', async (req, res) => {
    const { id_solicitud } = req.params;
    const { estado } = req.body;

    try {
        const solicitud = await Solicitud.findByPk(id_solicitud);
        if (!solicitud) {
            return res.status(404).json({ error: 'Solicitud no encontrada' });
        }

        solicitud.estado = estado;
        await solicitud.save();

        res.json({ message: 'Estado de la solicitud actualizado', solicitud });
    } catch (error) {
        console.error('Error al actualizar la solicitud:', error);
        res.status(500).json({ error: 'Error al actualizar la solicitud' });
    }
});

// Ruta para actualizar el estado de una solicitud
router.put('/:id_solicitud', async (req, res) => {
    const { id_solicitud } = req.params;
    const { estado } = req.body;

    try {
        // Encontrar la solicitud actual
        const solicitud = await Solicitud.findByPk(id_solicitud);
        if (!solicitud) {
            return res.status(404).json({ error: 'Solicitud no encontrada' });
        }

        // Si el estado es "aceptada", verifica si ya existe una solicitud aceptada para esta mascota
        if (estado === 'aceptada') {
            const existeAceptada = await Solicitud.findOne({
                where: {
                    id_mascota: solicitud.id_mascota,
                    estado: 'aceptada'
                }
            });

            if (existeAceptada) {
                return res.status(400).json({ error: 'Ya existe una solicitud aceptada para esta mascota' });
            }
        }

        // Actualizar el estado de la solicitud
        solicitud.estado = estado;
        await solicitud.save();

        res.json(solicitud);
    } catch (error) {
        console.error('Error al actualizar la solicitud:', error);
        res.status(500).json({ error: 'Error al actualizar la solicitud' });
    }
});



module.exports = router;
