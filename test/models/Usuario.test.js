// Import required modules
const { sequelize } = require('../../src/config/database'); // Import sequelize instance
const Usuario = require('../../src/models/Usuario');
const Mascota = require('../../src/models/Mascota'); // Assuming Mascota model exists
const Solicitud = require('../../src/models/Solicitud'); // Add this
const { Sequelize, DataTypes } = require('sequelize');

Usuario.associate({ Mascota, Solicitud });
Mascota.associate({ Usuario, Solicitud });
Solicitud.associate({ Usuario, Mascota });


test('should create a new Usuario successfully', async () => {
  const usuarioData = {
    nombre: 'nuevo',
    email: 'nuevo@example.com',
    password: 'securepassword123',
  };

  const usuario = await Usuario.create(usuarioData);

  expect(usuario).toBeDefined();
  expect(usuario.nombre).toBe('nuevo');
  expect(usuario.email).toBe('nuevo@example.com');
});


test('should not allow creating a Usuario with duplicate email', async () => {
  const usuarioData = {
    nombre: 'tereore',
    email: 'tereore@example.com',
    password: 'securepassword123',
  };

  await Usuario.create(usuarioData);

  // Expect error when attempting to create a user with the same email
  await expect(Usuario.create(usuarioData)).rejects.toThrow();
});

