const { sequelize } = require('../../src/config/database');
const Mascota = require('../../src/models/Mascota');
const Usuario = require('../../src/models/Usuario');
const Solicitud = require('../../src/models/Solicitud'); // Assuming Solicitud model exists

// Jest setup and teardown
// beforeAll(async () => {
//   await sequelize.sync({ force: true });
// });

// afterAll(async () => {
//   await sequelize.close();
// });

describe('Mascota Model', () => {
  test('should create a new Mascota successfully', async () => {
    const usuario = await Usuario.create({
      nombre: 'John Doe',
      email: 'john@example.com',
      password: 'securepassword123'
    });

    const mascotaData = {
      id_usuario: usuario.id,
      nombre: 'Max',
      tamano_aproximado: 'Mediano',
      edad_aproximada: 2,
      edad_unidad: 'años',
      especie: 'Perro',
      raza: 'Labrador',
      fotos: 'foto.jpg',
      comportamiento: 'Amigable y juguetón',
      salud: true,
      region: 'Metropolitana',
      detallesSalud: 'Vacunas al día',
      created: new Date()
    };

    const mascota = await Mascota.create(mascotaData);

    expect(mascota).toBeDefined();
    expect(mascota.nombre).toBe(mascotaData.nombre);
    expect(mascota.id_usuario).toBe(usuario.id);
  });

  test('should not create a Mascota without required fields', async () => {
    await expect(Mascota.create({})).rejects.toThrow();
  });

  test('should validate association with Usuario', async () => {
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

    const foundMascota = await Mascota.findOne({
      where: { id_mascota: mascota.id_mascota },
      include: Usuario
    });

    expect(foundMascota.Usuario).toBeDefined();
    expect(foundMascota.Usuario.nombre).toBe(usuario.nombre);
  });

  test('should validate association with Solicitud', async () => {
    const usuario = await Usuario.create({
      nombre: 'Carlos',
      email: 'carlos@example.com',
      password: 'superpassword'
    });

    const mascota = await Mascota.create({
      id_usuario: usuario.id,
      nombre: 'Luna',
      especie: 'Gato'
    });

    const solicitud = await Solicitud.create({
      id_mascota: mascota.id_mascota,
      estado: 'Pendiente' // Adjust based on actual fields in the Solicitud model
    });

    const foundMascota = await Mascota.findOne({
      where: { id_mascota: mascota.id_mascota },
      include: Solicitud
    });

    expect(foundMascota.Solicituds.length).toBeGreaterThan(0); // or however you pluralize "Solicitud"
    expect(foundMascota.Solicituds[0].estado).toBe('Pendiente');
  });

  test('should retrieve Mascota with correct data types', async () => {
    const mascota = await Mascota.create({
      nombre: 'Milo',
      tamano_aproximado: 'Pequeño',
      edad_aproximada: 1,
      edad_unidad: 'mes',
      especie: 'Perro'
    });

    expect(typeof mascota.nombre).toBe('string');
    expect(typeof mascota.edad_aproximada).toBe('number');
    expect(mascota.salud).toBeDefined();
  });
});
