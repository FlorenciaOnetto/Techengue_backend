const { password } = require("pg/lib/defaults");

module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('Chat', [
    {
      FechaInicio: '2023-11-8',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
  ]),
  down: (queryInterface) => queryInterface.bulkDelate('Chat', null, {}),
    
};
