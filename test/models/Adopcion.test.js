const { sequelize } = require('../../src/config/database');
const Adopcion = require('../../src/models/Adopcion');
const Solicitud = require('../../src/models/Solicitud');
const Resena = require('../../src/models/Resena'); // Assuming Resena model exists

// Jest setup and teardown
// beforeAll(async () => {
//   await sequelize.sync({ force: true });
// });

// afterAll(async () => {
//   await sequelize.close();
// });

describe('Adopcion Model', () => {
  test('should create a new Adopcion successfully', async () => {
    const solicitud = await Solicitud.create({
      id_mascota: 1, // Assuming a valid id_mascota
      id_potencial_adoptante: 1, // Assuming a valid id_potencial_adoptante
      estado: 'Aprobado',
      razones: 'Responsible and caring',
      descripcion_hogar: 'House with garden',
      experiencia: true,
      contacto: 'contact@example.com',
      created: new Date()
    });

    const adopcionData = {
      id_solicitud: solicitud.id_solicitud,
      created: new Date()
    };

    const adopcion = await Adopcion.create(adopcionData);

    expect(adopcion).toBeDefined();
    expect(adopcion.id_solicitud).toBe(solicitud.id_solicitud);
  });

  test('should not create an Adopcion without required fields', async () => {
    await expect(Adopcion.create({})).rejects.toThrow();
  });

  test('should validate association with Solicitud', async () => {
    const solicitud = await Solicitud.create({
      id_mascota: 2,
      id_potencial_adoptante: 2,
      estado: 'En Proceso',
      razones: 'Loves animals',
      descripcion_hogar: 'Apartment with balcony',
      experiencia: false,
      contacto: 'test@example.com'
    });

    const adopcion = await Adopcion.create({
      id_solicitud: solicitud.id_solicitud,
      created: new Date()
    });

    const foundAdopcion = await Adopcion.findOne({
      where: { id_adopcion: adopcion.id_adopcion },
      include: Solicitud
    });

    expect(foundAdopcion.Solicitud).toBeDefined();
    expect(foundAdopcion.Solicitud.estado).toBe('En Proceso');
  });

  test('should validate association with Resena', async () => {
    const solicitud = await Solicitud.create({
      id_mascota: 3,
      id_potencial_adoptante: 3,
      estado: 'Finalizado',
      razones: 'Loves dogs',
      descripcion_hogar: 'House with backyard',
      experiencia: true,
      contacto: 'example@example.com'
    });

    const adopcion = await Adopcion.create({
      id_solicitud: solicitud.id_solicitud,
      created: new Date()
    });

    const resena = await Resena.create({
      id_adopcion: adopcion.id_adopcion,
      comentario: 'Great adoption experience',
      calificacion: 5
    });

    const foundAdopcion = await Adopcion.findOne({
      where: { id_adopcion: adopcion.id_adopcion },
      include: Resena
    });

    expect(foundAdopcion.Resena).toBeDefined();
    expect(foundAdopcion.Resena.comentario).toBe('Great adoption experience');
    expect(foundAdopcion.Resena.calificacion).toBe(5);
  });

  test('should retrieve Adopcion with correct data types', async () => {
    const adopcion = await Adopcion.create({
      id_solicitud: 1,
      created: new Date()
    });

    expect(typeof adopcion.id_solicitud).toBe('number');
    expect(adopcion.created).toBeInstanceOf(Date);
  });
});
