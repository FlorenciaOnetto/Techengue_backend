const { Sequelize, DataTypes } = require('sequelize');
const Mascota = require('../../src/models/Mascota');
const Usuario = require('../../src/models/Usuario');
const Solicitud = require('../../src/models/Solicitud');
const sequelize = require('../../src/config/database');


Usuario.associate({ Mascota, Solicitud });
Mascota.associate({ Usuario, Solicitud });
Solicitud.associate({ Usuario, Mascota });



test('should define Mascota model correctly', () => {
  expect(Mascota).toBeDefined();
  expect(Mascota.tableName).toBe('Mascotas');
});

test('should create a Mascota successfully', async () => {
  const usuario = await Usuario.create({
    nombre: 'cristobal',
    email: 'cristobal@example.com',
    password: 'securepassword123',
  });

  const mascota = await Mascota.create({
    nombre: 'lily',
    tamano_aproximado: 'Grande',
    edad_aproximada: 5,
    edad_unidad: 'años',
    especie: 'Perro',
    raza: 'Labrador',
    fotos: null,
    comportamiento: 'Amigable',
    salud: true,
    detallesSalud: 'Ninguno',
    region: 'Santiago',
    id_usuario: usuario.id_usuario,
  });

  expect(mascota).toBeDefined();
  expect(mascota.nombre).toBe('Negra');
  expect(mascota.id_usuario).toBe(usuario.id_usuario);
});

test('should enforce required fields', async () => {
  await expect(
    Mascota.create({
      tamano_aproximado: 'Grande', // Missing required fields like `nombre`
    })
  ).rejects.toThrow(/notNull Violation/);
});

