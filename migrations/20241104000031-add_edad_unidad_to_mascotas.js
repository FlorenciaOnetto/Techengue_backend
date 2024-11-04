'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('mascotas', 'edad_unidad', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'años' // Puedes establecer "años" como valor predeterminado
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('mascotas', 'edad_unidad');
  }
};
