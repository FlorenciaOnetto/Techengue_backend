const { sequelize } = require('../../src/config/database');
const Mensaje = require('../../src/models/Mensaje');
const Chat = require('../../src/models/Chat');
const Solicitud = require('../../src/models/Solicitud'); // Assuming Solicitud model exists

// Jest setup and teardown
// beforeAll(async () => {
//   await sequelize.sync({ force: true });
// });

// afterAll(async () => {
//   await sequelize.close();
// });

describe('Mensaje Model', () => {
  test('should create a new Mensaje successfully', async () => {
    const solicitud = await Solicitud.create({
      id_mascota: 1, // Assuming a valid id_mascota
      id_potencial_adoptante: 1, // Assuming a valid id_potencial_adoptante
      estado: 'Pendiente',
      razones: 'Interested in adopting a pet',
      descripcion_hogar: 'House with backyard',
      experiencia: true,
      contacto: 'contact@example.com',
      created: new Date()
    });

    const chat = await Chat.create({
      id_solicitud: solicitud.id_solicitud
    });

    const mensajeData = {
      id_chat: chat.id_chat,
      contenido: 'Hello, I am interested in adopting this pet!'
    };

    const mensaje = await Mensaje.create(mensajeData);

    expect(mensaje).toBeDefined();
    expect(mensaje.id_chat).toBe(chat.id_chat);
    expect(mensaje.contenido).toBe(mensajeData.contenido);
  });

  test('should not create a Mensaje without required fields', async () => {
    await expect(Mensaje.create({})).rejects.toThrow();
  });

  test('should validate association with Chat', async () => {
    const solicitud = await Solicitud.create({
      id_mascota: 2,
      id_potencial_adoptante: 2,
      estado: 'En Proceso',
      razones: 'Caring and responsible',
      descripcion_hogar: 'Apartment with balcony',
      experiencia: false,
      contacto: 'user@example.com'
    });

    const chat = await Chat.create({
      id_solicitud: solicitud.id_solicitud
    });

    const mensaje = await Mensaje.create({
      id_chat: chat.id_chat,
      contenido: 'Can we schedule a meeting to discuss adoption?'
    });

    const foundMensaje = await Mensaje.findOne({
      where: { id_mensaje: mensaje.id_mensaje },
      include: Chat
    });

    expect(foundMensaje.Chat).toBeDefined();
    expect(foundMensaje.Chat.id_chat).toBe(chat.id_chat);
  });

  test('should retrieve Mensaje with correct data types', async () => {
    const mensaje = await Mensaje.create({
      id_chat: 1, // Assuming a valid id_chat
      contenido: 'This is a test message.'
    });

    expect(typeof mensaje.id_chat).toBe('number');
    expect(typeof mensaje.contenido).toBe('string');
  });
});
