const { sequelize } = require('../../src/config/database');
const Solicitud = require('../../src/models/Solicitud');
const Mascota = require('../../src/models/Mascota');
const Usuario = require('../../src/models/Usuario');
const Adopcion = require('../../src/models/Adopcion'); // Assuming Adopcion model exists
const Chat = require('../../src/models/Chat'); // Assuming Chat model exists

// Jest setup and teardown
// beforeAll(async () => {
//   await sequelize.sync({ force: true });
// });

// afterAll(async () => {
//   await sequelize.close();
// });

describe('Solicitud Model', () => {
  test('should create a new Solicitud successfully', async () => {
    const usuario = await Usuario.create({
      nombre: 'John Doe',
      email: 'john@example.com',
      password: 'securepassword123'
    });

    const mascota = await Mascota.create({
      id_usuario: usuario.id,
      nombre: 'Max',
      especie: 'Perro'
    });

    const solicitudData = {
      id_mascota: mascota.id_mascota,
      id_potencial_adoptante: usuario.id,
      estado: 'Pendiente',
      razones: 'Me encantan los perros',
      descripcion_hogar: 'Casa con jardín amplio',
      experiencia: true,
      contacto: '123-456-7890',
      created: new Date()
    };

    const solicitud = await Solicitud.create(solicitudData);

    expect(solicitud).toBeDefined();
    expect(solicitud.estado).toBe(solicitudData.estado);
    expect(solicitud.contacto).toBe(solicitudData.contacto);
  });

  test('should not create a Solicitud without required fields', async () => {
    await expect(Solicitud.create({})).rejects.toThrow();
  });

  test('should validate association with Mascota', async () => {
    const usuario = await Usuario.create({
      nombre: 'Alice',
      email: 'alice@example.com',
      password: 'mypassword'
    });

    const mascota = await Mascota.create({
      id_usuario: usuario.id,
      nombre: 'Buddy',
      especie: 'Perro'
    });

    const solicitud = await Solicitud.create({
      id_mascota: mascota.id_mascota,
      id_potencial_adoptante: usuario.id,
      estado: 'Aprobado'
    });

    const foundSolicitud = await Solicitud.findOne({
      where: { id_solicitud: solicitud.id_solicitud },
      include: Mascota
    });

    expect(foundSolicitud.Mascota).toBeDefined();
    expect(foundSolicitud.Mascota.nombre).toBe(mascota.nombre);
  });

  test('should validate association with Usuario', async () => {
    const usuario = await Usuario.create({
      nombre: 'Carlos',
      email: 'carlos@example.com',
      password: 'securepassword'
    });

    const mascota = await Mascota.create({
      id_usuario: usuario.id,
      nombre: 'Luna',
      especie: 'Gato'
    });

    const solicitud = await Solicitud.create({
      id_mascota: mascota.id_mascota,
      id_potencial_adoptante: usuario.id,
      estado: 'Rechazado'
    });

    const foundSolicitud = await Solicitud.findOne({
      where: { id_solicitud: solicitud.id_solicitud },
      include: Usuario
    });

    expect(foundSolicitud.Usuario).toBeDefined();
    expect(foundSolicitud.Usuario.nombre).toBe(usuario.nombre);
  });

  test('should validate association with Adopcion and Chat', async () => {
    const usuario = await Usuario.create({
      nombre: 'Emma',
      email: 'emma@example.com',
      password: 'password123'
    });

    const mascota = await Mascota.create({
      id_usuario: usuario.id,
      nombre: 'Oliver',
      especie: 'Perro'
    });

    const solicitud = await Solicitud.create({
      id_mascota: mascota.id_mascota,
      id_potencial_adoptante: usuario.id,
      estado: 'Pendiente'
    });

    const adopcion = await Adopcion.create({
      id_solicitud: solicitud.id_solicitud,
      fecha: new Date()
    });

    const chat = await Chat.create({
      id_solicitud: solicitud.id_solicitud,
      mensaje: 'Hello, interested in adopting!'
    });

    const foundSolicitud = await Solicitud.findOne({
      where: { id_solicitud: solicitud.id_solicitud },
      include: [Adopcion, Chat]
    });

    expect(foundSolicitud.Adopcion).toBeDefined();
    expect(foundSolicitud.Adopcion.fecha).toBeInstanceOf(Date);
    expect(foundSolicitud.Chat).toBeDefined();
    expect(foundSolicitud.Chat.mensaje).toBe('Hello, interested in adopting!');
  });

  test('should retrieve Solicitud with correct data types', async () => {
    const solicitud = await Solicitud.create({
      estado: 'En Proceso',
      razones: 'Tengo espacio suficiente',
      descripcion_hogar: 'Departamento amplio',
      experiencia: true,
      contacto: '987-654-3210'
    });

    expect(typeof solicitud.estado).toBe('string');
    expect(typeof solicitud.razones).toBe('string');
    expect(typeof solicitud.experiencia).toBe('boolean');
    expect(typeof solicitud.contacto).toBe('string');
  });
});
