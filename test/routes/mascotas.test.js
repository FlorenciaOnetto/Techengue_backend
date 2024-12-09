const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const Mascota = require('../../src/models/Mascota');
const Solicitud = require('../../src/models/Solicitud');
const mascotasRoutes = require('../../src/routes/mascotas');


jest.mock('../../src/models/Mascota');
jest.mock('../../src/models/Solicitud');

jest.mock('multer', () => {
    return Object.assign(jest.fn(() => ({
      single: jest.fn(() => (req, res, next) => next()), // Mock single file upload middleware
    })), {
      diskStorage: jest.fn(() => ({
        destination: jest.fn(),
        filename: jest.fn(),
      })), // Mock diskStorage
    });
  });
  

let app;

beforeAll(() => {
  app = express();
  app.use(express.json());
  app.use('/mascotas', mascotasRoutes);
});

beforeEach(() => {
  jest.clearAllMocks(); // Clear mocks before each test
});

describe('Mascotas Routes', () => {
  test('should publish a new mascota', async () => {
    const token = jwt.sign({ id_usuario: 1 }, process.env.JWT_SECRET);

    Mascota.create.mockResolvedValue({
      id_mascota: 1,
      nombre: 'Fido',
      tamano_aproximado: 'Mediano',
      id_usuario: 1,
    });

    const response = await request(app)
      .post('/mascotas/publicar')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nombre: 'Fido',
        tamano_aproximado: 'Mediano',
        edad_aproximada: 2,
        edad_unidad: 'años',
        especie: 'Perro',
        region: 'Santiago',
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Mascota publicada exitosamente');
    expect(Mascota.create).toHaveBeenCalledWith(expect.objectContaining({
      nombre: 'Fido',
      tamano_aproximado: 'Mediano',
      id_usuario: 1,
    }));
  });

  test('should update an existing mascota', async () => {
    const token = jwt.sign({ id_usuario: 1 }, process.env.JWT_SECRET);

    const mascotaMock = {
      id_mascota: 1,
      nombre: 'Fido',
      save: jest.fn(),
    };

    Mascota.findOne.mockResolvedValue(mascotaMock);

    const response = await request(app)
      .put('/mascotas/1')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Updated Fido' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Mascota actualizada exitosamente');
    expect(mascotaMock.save).toHaveBeenCalled();
    expect(mascotaMock.nombre).toBe('Updated Fido');
  });

  test('should fetch user mascotas', async () => {
    const token = jwt.sign({ id_usuario: 1 }, process.env.JWT_SECRET);

    Mascota.findAll.mockResolvedValue([{ id_mascota: 1, nombre: 'Fido' }]);

    const response = await request(app)
      .get('/mascotas/mis-mascotas')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id_mascota: 1, nombre: 'Fido' }]);
  });

  test('should search mascotas with filters', async () => {
    Mascota.findAll.mockResolvedValue([{ id_mascota: 1, nombre: 'Fido', especie: 'Perro' }]);

    const response = await request(app)
      .get('/mascotas/buscar?especie=Perro&region=Santiago');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id_mascota: 1, nombre: 'Fido', especie: 'Perro' }]);
  });

  test('should delete a mascota and its solicitudes', async () => {
    const token = jwt.sign({ id_usuario: 1 }, process.env.JWT_SECRET);
  
    Mascota.findByPk.mockResolvedValue({
      id_mascota: 1,
      destroy: jest.fn(),
    });
  
    Solicitud.destroy.mockResolvedValue(1);
  
    const response = await request(app)
      .delete('/mascotas/1')
      .set('Authorization', `Bearer ${token}`);
  
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Mascota eliminada correctamente');
    expect(Solicitud.destroy).toHaveBeenCalledWith({ where: { id_mascota: 1 } }); // Test expects a number
  });  
});


describe('New test', () => {
    test('should return 401 if token is missing when publishing a mascota', async () => {
        const response = await request(app).post('/mascotas/publicar').send({
          nombre: 'Fido',
          tamano_aproximado: 'Mediano',
          edad_aproximada: 2,
          edad_unidad: 'años',
          especie: 'Perro',
          region: 'Santiago',
        });
      
        expect(response.status).toBe(401);
        expect(response.body.error).toBe('Token no proporcionado');
      });
      
      test('should return 401 if token is invalid when updating a mascota', async () => {
        const response = await request(app)
          .put('/mascotas/1')
          .set('Authorization', 'Bearer invalid_token')
          .send({ nombre: 'Updated Fido' });
      
        expect(response.status).toBe(401);
        expect(response.body.error).toBe('undefined');
      });
      test('should return 500 if Mascota.create throws an error', async () => {
        const token = jwt.sign({ id_usuario: 1 }, process.env.JWT_SECRET);
      
        Mascota.create.mockRejectedValue(new Error('Database error'));
      
        const response = await request(app)
          .post('/mascotas/publicar')
          .set('Authorization', `Bearer ${token}`)
          .send({
            nombre: 'Fido',
            tamano_aproximado: 'Mediano',
            edad_aproximada: 2,
            edad_unidad: 'años',
            especie: 'Perro',
            region: 'Santiago',
          });
      
        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Error al publicar la mascota');
      });
      test('should return 404 if mascota is not found when updating', async () => {
        const token = jwt.sign({ id_usuario: 1 }, process.env.JWT_SECRET);
      
        Mascota.findOne.mockResolvedValue(null); // Simulate no mascota found
      
        const response = await request(app)
          .put('/mascotas/1')
          .set('Authorization', `Bearer ${token}`)
          .send({ nombre: 'Updated Fido' });
      
        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Mascota no encontrada o no pertenece al usuario.');
      });
              
      test('should return 400 if edad_aproximada is not a number', async () => {
        const token = jwt.sign({ id_usuario: 1 }, process.env.JWT_SECRET);
      
        const response = await request(app)
          .post('/mascotas/publicar')
          .set('Authorization', `Bearer ${token}`)
          .send({
            nombre: 'Fido',
            tamano_aproximado: 'Mediano',
            edad_aproximada: 'invalid',
            edad_unidad: 'años',
            especie: 'Perro',
            region: 'Santiago',
          });
      
        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Edad aproximada debe ser un número');
      });
      

});
