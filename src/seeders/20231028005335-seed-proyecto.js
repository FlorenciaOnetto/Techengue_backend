const { password } = require("pg/lib/defaults");

module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('ProyectoSolidario', [
    {
      titulo: 'Rescate Animales',
      descripcion: 'Necesitamos personas para acoger perros abandonados',
      fecha_inicio: '2023-8-11',
      fecha_finalizacion: '2025-8-11',
      objetivos: 'Encontrar hogar a perritos',
      categoria: 'Rescate Animal y Promoción de Adopción',
      proyect_userId: '3',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
  ]),
  down: (queryInterface) => queryInterface.bulkDelate('ProyectoSolidario', null, {}),
    
};
