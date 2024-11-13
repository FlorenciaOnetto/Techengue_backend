const express = require('express');
const expressJwt = require('express-jwt');
const Mascota = require('../models/Mascota');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { Op } = require('sequelize');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

router.post(
    '/publicar',
    expressJwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }),
    upload.single('fotos'),
    async (req, res) => {
        const { nombre, tamano_aproximado, edad_aproximada, edad_unidad, especie, raza, comportamiento, salud, region, detallesSalud } = req.body;
        const id_usuario = req.user.id_usuario;
        const fotos = req.file ? req.file.filename : null;

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
                detallesSalud, 
                region,
                id_usuario,
                created: new Date(),
            });

            res.status(201).json({ message: 'Mascota publicada exitosamente', mascota: nuevaMascota });
        } catch (error) {
            console.error("Error al crear la mascota:", error.message); 
            res.status(500).json({ error: 'Error al publicar la mascota' });
        }
    }
);

// Ruta para actualizar una mascota
router.put(
    '/:id',
    expressJwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }),
    upload.single('fotos'),
    async (req, res) => {
        const { id_mascota } = req.params;
        const { nombre, tamano_aproximado, edad_aproximada, edad_unidad, especie, raza, comportamiento, salud, region, detallesSalud } = req.body;
        const id_usuario = req.user.id_usuario; // ID del usuario autenticado
        const fotos = req.file ? req.file.filename : null;

        const edadAproximadaInt = parseInt(edad_aproximada, 10);
        const saludBoolean = salud === 'true';

        try {
            const mascota = await Mascota.findOne({ where: { id_mascota: id_mascota, id_usuario } });
            if (!mascota) {
                return res.status(404).json({ error: 'Mascota no encontrada o no pertenece al usuario.' });
            }

            // Actualiza los campos de la mascota
            mascota.nombre = nombre;
            mascota.tamano_aproximado = tamano_aproximado;
            mascota.edad_aproximada = edadAproximadaInt;
            mascota.edad_unidad = edad_unidad;
            mascota.especie = especie;
            mascota.raza = raza;
            mascota.comportamiento = comportamiento;
            mascota.salud = saludBoolean;
            mascota.region = region;
            mascota.detallesSalud = detallesSalud;

            if (fotos) {
                mascota.fotos = fotos; // Solo actualiza si se subió una nueva foto
            }

            await mascota.save();

            res.status(200).json({ message: 'Mascota actualizada exitosamente', mascota });
        } catch (error) {
            console.error("Error al actualizar la mascota:", error.message);
            res.status(500).json({ error: 'Error al actualizar la mascota' });
        }
    }
);


// Ruta para obtener todas las mascotas publicadas por el usuario autenticado
router.get(
    '/mis-mascotas',
    expressJwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }),
    async (req, res) => {
        const id_usuario = req.user.id_usuario; // Obtener el ID del usuario del token

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
        ...(tamano_aproximado && { tamano_aproximado }),
    };

    if (edad_aproximada && edad_unidad) {
        const valorEdad = parseInt(edad_aproximada, 10);
        
        // Cambiar las condiciones para que sean exactamente iguales
        condiciones.edad_aproximada = valorEdad;
        condiciones.edad_unidad = edad_unidad; // Asegúrate de que este campo esté presente en el modelo

        // Asegúrate de que la condición para edad_unidad esté en tu modelo, si no, puedes omitirla
    }

    try {
        const mascotas = await Mascota.findAll({ where: condiciones });
        console.log("Mascotas encontradas:", mascotas); // Log para ver las mascotas encontradas
        res.json(mascotas);
    } catch (error) {
        console.error("Error al buscar mascotas:", error.message);
        res.status(500).json({ error: 'Error al buscar mascotas' });
    }
});


// Ruta para obtener todas las mascotas
router.get('/todas', async (req, res) => {
    try {
        const mascotas = await Mascota.findAll();
        res.json(mascotas);
    } catch (error) {
        console.error('Error en la consulta de mascotas:', error);
        res.status(500).json({ error: error.message });
    }
});



// Ruta para obtener detalles de una mascota específica
router.get('/:id_mascota', async (req, res) => {
    try {
        const mascota = await Mascota.findByPk(req.params.id_mascota);
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
        const id_usuario = req.user.id_usuario; // ID del usuario autenticado
        const id_mascota = req.params.id_mascota;

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
