const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Usuario = require('../../src/models/Usuario');
const authRoutes = require('../../src/routes/auth');

let app;


beforeAll(() => {
  // Create Express app and register routes
  app = express();
  app.use(express.json());
  app.use('/auth', authRoutes);
});

beforeEach(() => {
  jest.clearAllMocks(); // Clear any mocked data
});

describe('Auth Routes', () => {
  test('should register a new user', async () => {
    Usuario.findOne = jest.fn().mockResolvedValue(null); // Simulate no user found
    Usuario.create = jest.fn().mockResolvedValue({
      id_usuario: 1,
      nombre: 'John Doe',
      email: 'john@example.com',
      password: 'hashedpassword',
    });

    const response = await request(app)
      .post('/auth/register')
      .send({ nombre: 'John Doe', email: 'john@example.com', password: 'password123' });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Usuario registrado exitosamente');
    expect(Usuario.create).toHaveBeenCalledWith({
      nombre: 'John Doe',
      email: 'john@example.com',
      password: expect.any(String), // Hashed password
    });
  });

  test('should not register an existing user', async () => {
    Usuario.findOne = jest.fn().mockResolvedValue({ email: 'jane@example.com' }); // Simulate user found

    const response = await request(app)
      .post('/auth/register')
      .send({ nombre: 'Jane Doe', email: 'jane@example.com', password: 'password123' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Usuario ya registrado');
  });

  test('should log in a user with valid credentials', async () => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    Usuario.findOne = jest.fn().mockResolvedValue({
      id_usuario: 1,
      email: 'john@example.com',
      password: hashedPassword,
    });

    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'john@example.com', password: 'password123' });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  test('should fetch authenticated user profile', async () => {
    const user = { id_usuario: 1, nombre: 'Alice', email: 'alice@example.com' };
    Usuario.findByPk = jest.fn().mockResolvedValue(user); // Simulate user lookup
    const token = jwt.sign({ id_usuario: user.id_usuario }, process.env.JWT_SECRET);

    const response = await request(app)
      .get('/auth/profile')
      .set('Authorization', `Bearer ${token}`); // Fixed syntax

    expect(response.status).toBe(200);
    expect(response.body.email).toBe('alice@example.com');
  });

  test('should update authenticated user profile', async () => {
    const user = { id_usuario: 1, nombre: 'Maria', email: 'maria@example.com', save: jest.fn() };
    Usuario.findByPk = jest.fn().mockResolvedValue(user); // Simulate user lookup
    const token = jwt.sign({ id_usuario: user.id_usuario }, process.env.JWT_SECRET);

    const response = await request(app)
      .put('/auth/profile')
      .set('Authorization', `Bearer ${token}`) // Fixed syntax
      .send({ nombre: 'Maria Updated', email: 'mariaupdated@example.com' });

    expect(response.status).toBe(200);
    expect(response.body.usuario.email).toBe('mariaupdated@example.com');
    expect(user.save).toHaveBeenCalled();
  });

  test('should delete authenticated user', async () => {
    const user = { id_usuario: 1, destroy: jest.fn() };
    Usuario.findByPk = jest.fn().mockResolvedValue(user); // Simulate user lookup
    const token = jwt.sign({ id_usuario: user.id_usuario }, process.env.JWT_SECRET);

    const response = await request(app)
      .delete('/auth/profile')
      .set('Authorization', `Bearer ${token}`); // Fixed syntax

    expect(response.status).toBe(204);
    expect(user.destroy).toHaveBeenCalled();
  });
});

describe('Auth Routes - Error Scenarios', () => {
    test('should return 401 if token is missing in /profile', async () => {
      const response = await request(app).get('/auth/profile');
      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Token no proporcionado');
    });
  
    test('should return 500 if database error occurs in /profile', async () => {
      Usuario.findByPk = jest.fn().mockRejectedValue(new Error('Database error'));
      const token = jwt.sign({ id_usuario: 1 }, process.env.JWT_SECRET);
  
      const response = await request(app)
        .get('/auth/profile')
        .set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Error en el servidor');
    });
  
    test('should return 500 if database error occurs in /register', async () => {
      Usuario.findOne = jest.fn().mockResolvedValue(null); // No user exists
      Usuario.create = jest.fn().mockRejectedValue(new Error('Database error'));
  
      const response = await request(app)
        .post('/auth/register')
        .send({ nombre: 'John Doe', email: 'john@example.com', password: 'password123' });
  
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Error en el servidor');
    });
  
    test('should return 401 if login credentials are incorrect', async () => {
      Usuario.findOne = jest.fn().mockResolvedValue(null); // User not found
  
      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'nonexistent@example.com', password: 'password123' });
  
      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Credenciales incorrectas');
    });
  
    test('should return 500 if database error occurs in /login', async () => {
      Usuario.findOne = jest.fn().mockRejectedValue(new Error('Database error'));
  
      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'john@example.com', password: 'password123' });
  
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Error en el servidor');
    });
  
    test('should return 404 if user is not found in /profile update', async () => {
      Usuario.findByPk = jest.fn().mockResolvedValue(null); // User not found
      const token = jwt.sign({ id_usuario: 1 }, process.env.JWT_SECRET);
  
      const response = await request(app)
        .put('/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({ nombre: 'Updated Name', email: 'updated@example.com' });
  
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Usuario no encontrado');
    });
  
    test('should return 500 if database error occurs in /profile update', async () => {
      Usuario.findByPk = jest.fn().mockRejectedValue(new Error('Database error'));
      const token = jwt.sign({ id_usuario: 1 }, process.env.JWT_SECRET);
  
      const response = await request(app)
        .put('/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({ nombre: 'Updated Name', email: 'updated@example.com' });
  
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Error en el servidor');
    });
  
    test('should return 404 if user is not found in /profile delete', async () => {
      Usuario.findByPk = jest.fn().mockResolvedValue(null); // User not found
      const token = jwt.sign({ id_usuario: 1 }, process.env.JWT_SECRET);
  
      const response = await request(app)
        .delete('/auth/profile')
        .set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Usuario no encontrado');
    });
  
    test('should return 500 if database error occurs in /profile delete', async () => {
      Usuario.findByPk = jest.fn().mockRejectedValue(new Error('Database error'));
      const token = jwt.sign({ id_usuario: 1 }, process.env.JWT_SECRET);
  
      const response = await request(app)
        .delete('/auth/profile')
        .set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Error al eliminar el usuario');
    });
  });
  