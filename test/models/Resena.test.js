const { sequelize } = require('../../src/config/database');
const Resena = require('../../src/models/Resena');
const Adopcion = require('../../src/models/Adopcion');
const Solicitud = require('../../src/models/Solicitud'); // Assuming Solicitud model exists

// Jest setup and teardown
// beforeAll(async () => {
//   await sequelize.sync({ force: true });
// });

// afterAll(async () => {
//   await sequelize.close();
// });

describe('Resena Model', () => {
  test('should create a new Resena successfully', async () => {
    const solicitud = await Solicitud.create({
      id_mascota: 1, // Assuming a valid id_mascota
      id_potencial_adoptante: 1, // Assuming a valid id_potencial_adoptante
      estado: 'Aprobado',
      razones: 'Love animals',
      descripcion_hogar: 'House with a garden',
      experiencia: true,
      contacto: 'user@example.com',
      created: new Date()
    });

    const adopcion = await Adopcion.create({
      id_solicitud: solicitud.id_solicitud,
      created: new Date()
    });

    const resenaData = {
      id_adopcion: adopcion.id_adopcion,
      nota: 5,
      descripcion: 'Great adoption process, very satisfied!',
      created: new Date()
    };

    const resena = await Resena.create(resenaData);

    expect(resena).toBeDefined();
    expect(resena.id_adopcion).toBe(adopcion.id_adopcion);
    expect(resena.nota).toBe(resenaData.nota);
    expect(resena.descripcion).toBe(resenaData.descripcion);
  });

  test('should not create a Resena without required fields', async () => {
    await expect(Resena.create({})).rejects.toThrow();
  });

  test('should validate association with Adopcion', async () => {
    const solicitud = await Solicitud.create({
      id_mascota: 2,
      id_potencial_adoptante: 2,
      estado: 'Finalizado',
      razones: 'Responsible pet owner',
      descripcion_hogar: 'Apartment with balcony',
      experiencia: true,
      contacto: 'owner@example.com'
    });

    const adopcion = await Adopcion.create({
      id_solicitud: solicitud.id_solicitud,
      created: new Date()
    });

    const resena = await Resena.create({
      id_adopcion: adopcion.id_adopcion,
      nota: 4,
      descripcion: 'Good experience, but could be improved.',
      created: new Date()
    });

    const foundResena = await Resena.findOne({
      where: { id_resena: resena.id_resena },
      include: Adopcion
    });

    expect(foundResena.Adopcion).toBeDefined();
    expect(foundResena.Adopcion.id_adopcion).toBe(adopcion.id_adopcion);
  });

  test('should retrieve Resena with correct data types', async () => {
    const resena = await Resena.create({
      id_adopcion: 1, // Assuming a valid id_adopcion
      nota: 3,
      descripcion: 'Average experience.',
      created: new Date()
    });

    expect(typeof resena.id_adopcion).toBe('number');
    expect(typeof resena.nota).toBe('number');
    expect(typeof resena.descripcion).toBe('string');
    expect(resena.created).toBeInstanceOf(Date);
  });
});
