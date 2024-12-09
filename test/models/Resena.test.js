const { sequelize } = require('../../src/config/database');
const Resena = require('../../src/models/Resena');
const Adopcion = require('../../src/models/Adopcion');
//const Solicitud = require('../../src/models/Solicitud'); // Assuming Solicitud model exists

Resena.associate({Adopcion});
Adopcion.associate({Resena});


test('should define Resena model correctly', () => {
  expect(Resena).toBeDefined();
  expect(Resena.tableName).toBe('Resenas');
});

test('should create a Resena successfully', async () => {
  const adopcion = await Adopcion.create({
    id_adopcion: 1, // Assuming a valid ID
  });

  const resena = await Resena.create({
    id_adopcion: adopcion.id_adopcion,
    nota: 5,
    descripcion: 'Excellent adoption process.',
    created: new Date(),
  });

  expect(resena).toBeDefined();
  expect(resena.nota).toBe(5);
  expect(resena.descripcion).toBe('Excellent adoption process.');
  expect(resena.id_adopcion).toBe(adopcion.id_adopcion);
});

test('should retrieve Resena with Adopcion association', async () => {
  const resena = await Resena.findOne({
    where: { nota: 5 },
    include: [{ model: Adopcion }],
  });

  expect(resena).toBeDefined();
  expect(resena.Adopcion).toBeDefined();
  expect(resena.Adopcion.id_adopcion).toBe(1);
});

test('should enforce required fields', async () => {
  await expect(
    Resena.create({
      descripcion: 'Missing required fields.', // Missing `id_adopcion` and `nota`
    })
  ).rejects.toThrow(/notNull Violation/);
});
