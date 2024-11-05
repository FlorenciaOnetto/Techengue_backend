const express = require('express');
const expressJwt = require('express-jwt');
const Mascota = require('../models/Mascota');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { Op } = require('sequelize');

// Configuración de Multer para manejar la subida de fotos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Ruta para publicar una mascota
router.post(
    '/publicar',
    expressJwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }),
    upload.single('fotos'),
    async (req, res) => {
        const { nombre, tamano_aproximado, edad_aproximada, edad_unidad, especie, raza, comportamiento, salud, region } = req.body;
        const id_usuario = req.user.id;
        const fotos = req.file ? req.file.filename : null;

        console.log("Datos recibidos en el backend:", {
            nombre, tamano_aproximado, edad_aproximada, edad_unidad, especie, raza, comportamiento, salud, region, id_usuario, fotos
        });

        const edadAproximadaInt = parseInt(edad_aproximada, 10);
        const saludBoolean = salud === 'true';

        try {
            const nuevaMascota = await Mascota.create({
                nombre,
                tamano_aproximado,
                edad_aproximada: edadAproximadaInt,
                edad_unidad,
                especie,
                raza,
                fotos,
                comportamiento,
                salud: saludBoolean,
                region,
                id_usuario,
            });

            res.status(201).json({ message: 'Mascota publicada exitosamente', mascota: nuevaMascota });
        } catch (error) {
            console.error("Error al crear la mascota:", error.message); 
            res.status(500).json({ error: 'Error al publicar la mascota' });
        }
    }
);

// Ruta para obtener todas las mascotas publicadas por el usuario autenticado
router.get(
    '/mis-mascotas',
    expressJwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }),
    async (req, res) => {
        const id_usuario = req.user.id; // Obtener el ID del usuario del token

        try {
            const mascotas = await Mascota.findAll({
                where: { id_usuario }
            });

            if (mascotas.length === 0) {
                console.log("No se encontraron mascotas publicadas para el usuario.");
            }

            res.json(mascotas);
        } catch (error) {
            console.error("Error al obtener las mascotas del usuario:", error.message);
            res.status(500).json({ error: 'Error al obtener las mascotas del usuario' });
        }
    }
);

// Ruta para buscar mascotas con filtros
router.get('/buscar', async (req, res) => {
    const { especie, region, tamano_aproximado, edad_aproximada, edad_unidad } = req.query;

    const condiciones = {
        ...(especie && { especie }),
        ...(region && { region }),
        ...(tamano_aproximado && { tamano_aproximado })
    };

    if (edad_aproximada && edad_unidad) {
        const valorEdad = parseInt(edad_aproximada, 10);

        if (edad_unidad === 'meses') {
            condiciones.edad_aproximada = {
                [Op.lte]: valorEdad
            };
        } else if (edad_unidad === 'años') {
            condiciones.edad_aproximada = {
                [Op.gte]: valorEdad * 12
            };
        }
    }

    try {
        const mascotas = await Mascota.findAll({ where: condiciones });
        res.json(mascotas);
    } catch (error) {
        console.error("Error al buscar mascotas:", error.message);
        res.status(500).json({ error: 'Error al buscar mascotas' });
    }
});

// Ruta para obtener detalles de una mascota específica
router.get('/:id', async (req, res) => {
    try {
        const mascota = await Mascota.findByPk(req.params.id);
        if (!mascota) {
            return res.status(404).json({ error: 'Mascota no encontrada' });
        }
        res.json(mascota);
    } catch (error) {
        console.error("Error al obtener la mascota:", error.message);
        res.status(500).json({ error: 'Error al obtener la mascota' });
    }
});

// Ruta para eliminar una mascota específica
router.delete(
    '/:id',
    expressJwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }),
    async (req, res) => {
        const id_usuario = req.user.id; // ID del usuario autenticado
        const id_mascota = req.params.id;

        try {
            const mascota = await Mascota.findOne({ where: { id_mascota, id_usuario } });
            if (!mascota) {
                return res.status(404).json({ error: 'Mascota no encontrada o no pertenece al usuario.' });
            }

            await mascota.destroy();
            res.status(200).json({ message: 'Mascota eliminada exitosamente.' });
        } catch (error) {
            console.error("Error al eliminar la mascota:", error.message);
            res.status(500).json({ error: 'Error al eliminar la mascota' });
        }
    }
);


module.exports = router;
