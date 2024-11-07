const express = require('express');
const expressJwt = require('express-jwt');
const Mascota = require('../models/Mascota');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { Op } = require('sequelize');

// Configuración de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// routes/mascotas.js
router.post(
    '/publicar',
    expressJwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }),
    upload.single('fotos'),
    async (req, res) => {
        const { nombre, tamano_aproximado, edad_aproximada, edad_unidad, especie, raza, comportamiento, salud, region } = req.body;
        const id_usuario = req.user.id;
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

router.get('/buscar', async (req, res) => {
    const { especie, region, tamano_aproximado, edad_aproximada, edad_unidad } = req.query;

    console.log("Parámetros recibidos en req.query:", req.query);

    const condiciones = {
        ...(especie && { especie }),
        ...(region && { region }),
        ...(tamano_aproximado && { tamano_aproximado })
    };

     // Filtrar por edad aproximada y unidad
    if (edad_aproximada && edad_unidad) {
        const valorEdad = parseInt(edad_aproximada, 10); // Asegúrate de que esto es un número

        if (edad_unidad === 'meses') {
            // Filtrar solo los que son menores o iguales a valorEdad
            condiciones.edad_aproximada = {
                [Op.lte]: valorEdad // Hasta el número de meses
            };
        } else if (edad_unidad === 'años') {
            // Filtrar para años
            condiciones.edad_aproximada = {
                [Op.gte]: valorEdad * 12 // Convertir años a meses
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

// Ruta para obtener todas las mascotas
router.get('/todas', async (req, res) => {
    try {
        const mascotas = await Mascota.findAll();
        res.json(mascotas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


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



module.exports = router;
