const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const Solicitud = require('../../src/models/Solicitud');
const Mascota = require('../../src/models/Mascota');
const Usuario = require('../../src/models/Usuario');
const solicitudesRoutes = require('../../src/routes/solicitudes');


jest.mock('../../src/models/Solicitud');
jest.mock('../../src/models/Mascota');
jest.mock('../../src/models/Usuario');

let app;

beforeAll(() => {
  app = express();
  app.use(express.json());
  app.use('/solicitudes', solicitudesRoutes);
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Solicitudes Routes', () => {
  test('should fetch all solicitudes for a specific mascota', async () => {
    Solicitud.findAll.mockResolvedValue([
      {
        id_solicitud: 1,
        id_mascota: 1,
        id_potencial_adoptante: 1,
        estado: 'pendiente',
        mascota: { nombre: 'Fido' },
        potencial_adoptante: { nombre: 'John Doe' },
      },
    ]);

    const response = await request(app).get('/solicitudes/mascota/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        id_solicitud: 1,
        id_mascota: 1,
        id_potencial_adoptante: 1,
        estado: 'pendiente',
        mascota: { nombre: 'Fido' },
        potencial_adoptante: { nombre: 'John Doe' },
      },
    ]);
  });

  test('should create a new solicitud', async () => {
    const token = jwt.sign({ id_usuario: 1 }, process.env.JWT_SECRET);

    Solicitud.findOne.mockResolvedValue(null); // No existing solicitud
    Solicitud.create.mockResolvedValue({
      id_solicitud: 1,
      id_mascota: 1,
      id_potencial_adoptante: 1,
      estado: 'pendiente',
    });

    const response = await request(app)
      .post('/solicitudes/crear')
      .set('Authorization', `Bearer ${token}`)
      .send({
        id_mascota: 1,
        estado: 'pendiente',
        razones: 'Love dogs',
        tipo_vivienda: 'Apartment',
        contacto: 'john@example.com',
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Solicitud creada exitosamente');
    expect(Solicitud.create).toHaveBeenCalledWith(
      expect.objectContaining({
        id_mascota: 1,
        id_potencial_adoptante: 1,
        estado: 'pendiente',
        razones: 'Love dogs',
        tipo_vivienda: 'Apartment',
        contacto: 'john@example.com',
      })
    );
  });

  test('should fetch solicitudes for the authenticated user', async () => {
    const token = jwt.sign({ id_usuario: 1 }, process.env.JWT_SECRET);

    Solicitud.findAll.mockResolvedValue([
      {
        id_solicitud: 1,
        id_mascota: 1,
        estado: 'pendiente',
        mascota: { nombre: 'Fido' },
      },
    ]);

    const response = await request(app)
      .get('/solicitudes/usuario/solicitudes')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        id_solicitud: 1,
        id_mascota: 1,
        estado: 'pendiente',
        mascota: { nombre: 'Fido' },
      },
    ]);
  });
});
