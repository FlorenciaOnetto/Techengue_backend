const { sequelize } = require('../../src/config/database');
const Chat = require('../../src/models/Chat');
const Solicitud = require('../../src/models/Solicitud');
const Mensaje = require('../../src/models/Mensaje'); // Assuming Mensaje model exists


// Jest setup and teardown
// beforeAll(async () => {
//   await sequelize.sync({ force: true });
// });

// afterAll(async () => {
//   await sequelize.close();
// });

describe('Chat Model', () => {
  test('should create a new Chat successfully', async () => {
    const solicitud = await Solicitud.create({
      id_mascota: 1, // Assuming a valid id_mascota
      id_potencial_adoptante: 1, // Assuming a valid id_potencial_adoptante
      estado: 'Pendiente',
      razones: 'Interested in adoption',
      descripcion_hogar: 'House with backyard',
      experiencia: true,
      contacto: 'user@example.com',
      created: new Date()
    });

    const chatData = {
      id_solicitud: solicitud.id_solicitud
    };

    const chat = await Chat.create(chatData);

    expect(chat).toBeDefined();
    expect(chat.id_solicitud).toBe(solicitud.id_solicitud);
  });

  test('should not create a Chat without required fields', async () => {
    await expect(Chat.create({})).rejects.toThrow();
  });

  test('should validate association with Solicitud', async () => {
    const solicitud = await Solicitud.create({
      id_mascota: 2,
      id_potencial_adoptante: 2,
      estado: 'En Proceso',
      razones: 'Caring and responsible',
      descripcion_hogar: 'Apartment',
      experiencia: false,
      contacto: 'another@example.com'
    });

    const chat = await Chat.create({
      id_solicitud: solicitud.id_solicitud
    });

    const foundChat = await Chat.findOne({
      where: { id_chat: chat.id_chat },
      include: Solicitud
    });

    expect(foundChat.Solicitud).toBeDefined();
    expect(foundChat.Solicitud.estado).toBe('En Proceso');
  });

  test('should validate association with Mensaje', async () => {
    const solicitud = await Solicitud.create({
      id_mascota: 3,
      id_potencial_adoptante: 3,
      estado: 'Aprobado',
      razones: 'Experience with pets',
      descripcion_hogar: 'House with garden',
      experiencia: true,
      contacto: 'third@example.com'
    });

    const chat = await Chat.create({
      id_solicitud: solicitud.id_solicitud
    });

    const mensaje = await Mensaje.create({
      id_chat: chat.id_chat,
      contenido: 'Hello, I am interested in adopting!',
      fecha: new Date()
    });

    const foundChat = await Chat.findOne({
      where: { id_chat: chat.id_chat },
      include: Mensaje
    });

    expect(foundChat.Mensajes.length).toBeGreaterThan(0);
    expect(foundChat.Mensajes[0].contenido).toBe('Hello, I am interested in adopting!');
  });

  test('should retrieve Chat with correct data types', async () => {
    const chat = await Chat.create({
      id_solicitud: 1 // Assuming a valid solicitud
    });

    expect(typeof chat.id_solicitud).toBe('number');
  });
});
