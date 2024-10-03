const { password } = require("pg/lib/defaults");

module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('Resena', [
    {
      contenido: 'Muy buen proyecto',
      fecha_resena: '2023-8-11',
      calificacion: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
  ]),
  down: (queryInterface) => queryInterface.bulkDelate('Resena', null, {}),
    
};
