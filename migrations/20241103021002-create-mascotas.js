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
          model: 'Usuarios', // Asegúrate de que el nombre sea correcto
          key: 'id_usuario', // Debe coincidir con el nombre en el modelo Usuario
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      nombre: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      tamano_aproximado: Sequelize.STRING,
      edad_aproximada: Sequelize.INTEGER,
      edad_unidad: Sequelize.STRING,
      especie: Sequelize.STRING,
      raza: Sequelize.STRING,
      fotos: Sequelize.STRING,
      comportamiento: Sequelize.TEXT,
      salud: Sequelize.BOOLEAN,
      region: Sequelize.STRING,
      detallesSalud: Sequelize.TEXT,
      created: {
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