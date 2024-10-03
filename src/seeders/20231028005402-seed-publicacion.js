const { password } = require("pg/lib/defaults");

module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('Publicacion', [
    {
      contenido: 'Foto de perros',
      fecha_publicacion: '2011-12-4',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
  ]),
  down: (queryInterface) => queryInterface.bulkDelate('Publicacion', null, {}),
    
};
