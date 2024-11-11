// Import required modules
const { sequelize } = require('../../src/config/database'); // Import sequelize instance
const Usuario = require('../../src/models/Usuario');
const Mascota = require('../../src/models/Mascota'); // Assuming Mascota model exists
const { DataTypes } = require('sequelize');

// Setup Jest hooks for the tests
// beforeAll(async () => {
//   await sequelize.sync({ force: true }); // Sync database and force reset
// });

// afterAll(async () => {
//   await sequelize.close(); // Close the database connection after tests
// });

describe('Usuario Model', () => {
  test('should create a new Usuario successfully', async () => {
    const usuarioData = {
      nombre: 'John Doe',
      email: 'john@example.com',
      password: 'securepassword123'
    };

    const usuario = await Usuario.create(usuarioData);

    expect(usuario).toBeDefined();
    expect(usuario.id).toBeDefined();
    expect(usuario.nombre).toBe(usuarioData.nombre);
    expect(usuario.email).toBe(usuarioData.email);
  });

  test('should not allow creating a Usuario with duplicate email', async () => {
    const usuarioData = {
      nombre: 'Jane Doe',
      email: 'jane@example.com',
      password: 'anotherpassword'
    };
    
    await Usuario.create(usuarioData);

    await expect(Usuario.create(usuarioData)).rejects.toThrow();
  });

  test('should associate a Usuario with Mascota', async () => {
    const usuario = await Usuario.create({
      nombre: 'Alice',
      email: 'alice@example.com',
      password: 'testpassword'
    });

    const mascota = await Mascota.create({
      nombre: 'Firulais',
      id_usuario: usuario.id
    });

    const userWithMascotas = await Usuario.findOne({
      where: { id: usuario.id },
      include: Mascota
    });

    expect(userWithMascotas.Mascotas.length).toBeGreaterThan(0);
    expect(userWithMascotas.Mascotas[0].nombre).toBe('Firulais');
  });

  test('should validate required fields', async () => {
    await expect(Usuario.create({
      email: 'missingname@example.com',
      password: 'nopassword'
    })).rejects.toThrow();

    await expect(Usuario.create({
      nombre: 'No Email User',
      password: 'nopassword'
    })).rejects.toThrow();
  });
});
