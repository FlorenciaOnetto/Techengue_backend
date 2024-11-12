'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Eliminar la tabla "Mascotas"
    await queryInterface.dropTable('Mascotas');
  },

  async down (queryInterface, Sequelize) {
    // Recrear la tabla "Mascotas" en caso de revertir la migración
    await queryInterface.createTable('Mascotas', {
      id_mascota: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      nombre: {
        type: Sequelize.STRING,
        allowNull: true
      },
      tamaño_aproximado: {
        type: Sequelize.STRING,
        allowNull: true
      },
      edad_aproximada: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      especie: {
        type: Sequelize.STRING,
        allowNull: true
      },
      raza: {
        type: Sequelize.STRING,
        allowNull: true
      },
      fotos: {
        type: Sequelize.STRING,
        allowNull: true
      },
      comportamiento: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      salud: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      region: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  }
};

