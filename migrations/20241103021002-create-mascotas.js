'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Mascotas', {
      id_mascota: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Usuarios',
          key: 'id_usuario',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      nombre: Sequelize.STRING,
      tamaño_aproximado: Sequelize.STRING,
      edad_aproximada: Sequelize.INTEGER,
      especie: Sequelize.STRING,
      raza: Sequelize.STRING,
      fotos: Sequelize.STRING,
      comportamiento: Sequelize.TEXT,
      salud: Sequelize.BOOLEAN,
      region: Sequelize.STRING,
      detallesSalud: Sequelize.TEXT,
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
    await queryInterface.dropTable('Mascotas');
  }
};
