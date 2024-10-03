const { password } = require("pg/lib/defaults");

module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('Fundacion', [
    {
      descripcion: 'Rescatamos animales',
      contacto: '56972472275',
      sitio_web: 'www.animales.com',
      user_id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
  ]),
  down: (queryInterface) => queryInterface.bulkDelate('Fundacion', null, {}),
    
};
