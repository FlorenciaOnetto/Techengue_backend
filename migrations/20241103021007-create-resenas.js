'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Resenas', {
      id_resena: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      id_adopcion: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Adopciones',
          key: 'id_adopcion',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      nota: Sequelize.INTEGER,
      descripcion: Sequelize.TEXT,
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Resenas');
  }
};
