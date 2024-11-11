const express = require('express');
const expressJwt = require('express-jwt');
const Solicitud = require('../models/Solicitud');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { Op } = require('sequelize');


// Ruta POST para crear una solicitud de adopción
router.post('/crear', 
  expressJwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }),
  async (req, res) => {
    console.log('Datos recibidos:', req.body);
    const {
      id_mascota,
      id_potencial_adoptante,
      estado,
      razones,
      descripcion_hogar,
      experiencia,
      contacto
    } = req.body;

  try {
    // Crear una nueva solicitud
    const nuevaSolicitud = await Solicitud.create({
      id_mascota,
      id_potencial_adoptante,
      estado,
      razones,
      descripcion_hogar,
      experiencia,
      contacto,
      created: new Date()  // Asigna la fecha actual de creación
    });

    // Responder con el objeto creado
    res.status(201).json({
      message: 'Solicitud creada exitosamente',
      data: nuevaSolicitud
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear la solicitud', error });
  }
});

module.exports = router;
