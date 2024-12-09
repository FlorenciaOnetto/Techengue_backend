const { sequelize } = require('../../src/config/database');
const Adopcion = require('../../src/models/Adopcion');
const Solicitud = require('../../src/models/Solicitud');
const Resena = require('../../src/models/Resena'); // Assuming Resena model exists


Resena.associate({ Adopcion, Solicitud });
Adopcion.associate({ Resena, Solicitud });
Solicitud.associate({ Resena, Adopcion });



test('should define Adopcion model correctly', () => {
  expect(Adopcion).toBeDefined();
  expect(Adopcion.tableName).toBe('Adopciones');
});

test('should create an Adopcion successfully', async () => {
  const solicitud = await Solicitud.create({
    id_solicitud: 1,
    estado: 'Aprobada',
  });

  const adopcion = await Adopcion.create({
    id_solicitud: solicitud.id_solicitud,
    created: new Date(),
  });

  expect(adopcion).toBeDefined();
  expect(adopcion.id_solicitud).toBe(solicitud.id_solicitud);
});

test('should retrieve Adopcion with Solicitud and Resena associations', async () => {
  const solicitud = await Solicitud.create({
    id_solicitud: 2,
    estado: 'Aprobada',
  });

  const adopcion = await Adopcion.create({
    id_solicitud: solicitud.id_solicitud,
    created: new Date(),
  });

  const resena = await Resena.create({
    id_adopcion: adopcion.id_adopcion,
    nota: 5,
    descripcion: 'Amazing experience!',
  });

  const fetchedAdopcion = await Adopcion.findOne({
    where: { id_adopcion: adopcion.id_adopcion },
    include: [
      { model: Solicitud, as: 'Solicitud' },
      { model: Resena, as: 'Resena' },
    ],
  });

  expect(fetchedAdopcion).toBeDefined();
  expect(fetchedAdopcion.Solicitud).toBeDefined();
  expect(fetchedAdopcion.Solicitud.estado).toBe('Aprobada');
  expect(fetchedAdopcion.Resena).toBeDefined();
  expect(fetchedAdopcion.Resena.nota).toBe(5);
});

test('should enforce required fields', async () => {
  await expect(
    Adopcion.create({
      created: new Date(), // Missing `id_solicitud`
    })
  ).rejects.toThrow(/notNull Violation/);
});
