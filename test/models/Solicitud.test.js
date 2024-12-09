const { Sequelize, DataTypes } = require('sequelize');
const Mascota = require('../../src/models/Mascota');
const Usuario = require('../../src/models/Usuario');
const Solicitud = require('../../src/models/Solicitud');
const sequelize = require('../../src/config/database');


Usuario.associate({ Mascota, Solicitud });
Mascota.associate({ Usuario, Solicitud });
Solicitud.associate({ Usuario, Mascota });



test('should define Solicitud model correctly', () => {
  expect(Solicitud).toBeDefined();
  expect(Solicitud.tableName).toBe('Solicitudes');
});

test('should create a Solicitud successfully', async () => {
  const usuario = await Usuario.create({
    nombre: 'John Doe',
    email: 'johndoe@example.com',
    password: 'securepassword123',
  });

  const mascota = await Mascota.create({
    nombre: 'Bobby',
    tamano_aproximado: 'Mediano',
    id_usuario: usuario.id_usuario,
  });

  const solicitud = await Solicitud.create({
    id_mascota: mascota.id_mascota,
    id_potencial_adoptante: usuario.id_usuario,
    estado: 'Pendiente',
    tipo_vivienda: 'Casa',
    otra_mascota: true,
    experiencia: false,
    descripcion_experiencia: 'No previous experience',
    razones: 'I love animals!',
    contacto: 'johndoe@example.com',
  });

  expect(solicitud).toBeDefined();
  expect(solicitud.estado).toBe('Pendiente');
  expect(solicitud.id_mascota).toBe(mascota.id_mascota);
  expect(solicitud.id_potencial_adoptante).toBe(usuario.id_usuario);
});

test('should retrieve Solicitud with Mascota and Usuario associations', async () => {
  const solicitud = await Solicitud.findOne({
    where: { estado: 'Pendiente' },
    include: [
      { model: Mascota, as: 'mascota' },
      { model: Usuario, as: 'potencial_adoptante' },
    ],
  });

  expect(solicitud).toBeDefined();
  expect(solicitud.mascota).toBeDefined();
  expect(solicitud.mascota.nombre).toBe('Bobby');
  expect(solicitud.potencial_adoptante).toBeDefined();
  expect(solicitud.potencial_adoptante.nombre).toBe('John Doe');
});

test('should enforce required fields', async () => {
  await expect(
    Solicitud.create({
      estado: 'Pendiente', // Missing required fields: `id_mascota`, `id_potencial_adoptante`
    })
  ).rejects.toThrow(/notNull Violation/);
});
