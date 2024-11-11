const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const mascotasRouter = require('../../routes/mascotas');
const Mascota = require('../../models/Mascota');
const app = express();

// Mock Middleware and Database Models
jest.mock('../../models/Mascota');

// Setup Express to use the router
app.use(express.json());
app.use('/mascotas', mascotasRouter);

// Helper function to create a token for testing authenticated routes
const createToken = () => {
  const payload = { id: 1 };
  return jwt.sign(payload, process.env.JWT_SECRET, { algorithm: 'HS256' });
};

// Test Suite for Mascotas Routes
describe('Mascotas Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test /publicar Route
  it('POST /mascotas/publicar - should publish a new pet', async () => {
    const token = createToken();
    Mascota.create.mockResolvedValue({
      id: 1,
      nombre: 'Firulais',
      tamano_aproximado: 'Grande',
      edad_aproximada: 2,
      especie: 'Perro',
      raza: 'Golden Retriever',
      region: 'Metropolitana',
      id_usuario: 1,
      fotos: 'image.jpg'
    });

    const res = await request(app)
      .post('/mascotas/publicar')
      .set('Authorization', `Bearer ${token}`)
      .field('nombre', 'Firulais')
      .field('tamano_aproximado', 'Grande')
      .field('edad_aproximada', '2')
      .field('especie', 'Perro')
      .field('raza', 'Golden Retriever')
      .field('region', 'Metropolitana')
      .attach('fotos', 'path/to/image.jpg');

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'Mascota publicada exitosamente');
    expect(res.body).toHaveProperty('mascota');
  });

  // Test /mis-mascotas Route
  it('GET /mascotas/mis-mascotas - should get all pets for the authenticated user', async () => {
    const token = createToken();
    Mascota.findAll.mockResolvedValue([
      { id: 1, nombre: 'Firulais', id_usuario: 1 },
      { id: 2, nombre: 'Manchas', id_usuario: 1 }
    ]);

    const res = await request(app)
      .get('/mascotas/mis-mascotas')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  // Test /buscar Route
  it('GET /mascotas/buscar - should search for pets with given filters', async () => {
    Mascota.findAll.mockResolvedValue([
      { id: 1, nombre: 'Firulais', especie: 'Perro', region: 'Metropolitana' }
    ]);

    const res = await request(app)
      .get('/mascotas/buscar')
      .query({ especie: 'Perro', region: 'Metropolitana' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  // Test /todas Route
  it('GET /mascotas/todas - should retrieve all pets', async () => {
    Mascota.findAll.mockResolvedValue([
      { id: 1, nombre: 'Firulais' },
      { id: 2, nombre: 'Manchas' }
    ]);

    const res = await request(app).get('/mascotas/todas');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  // Test /:id Route
  it('GET /mascotas/:id - should retrieve a specific pet by id', async () => {
    Mascota.findByPk.mockResolvedValue({ id: 1, nombre: 'Firulais' });

    const res = await request(app).get('/mascotas/1');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('nombre', 'Firulais');
  });

  // Test DELETE /:id Route
  it('DELETE /mascotas/:id - should delete a specific pet by id for the authenticated user', async () => {
    const token = createToken();
    Mascota.findOne.mockResolvedValue({ destroy: jest.fn() });

    const res = await request(app)
      .delete('/mascotas/1')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Mascota eliminada exitosamente.');
  });
});
