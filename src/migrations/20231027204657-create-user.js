'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('User', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombre: {
        type: Sequelize.STRING,
        allowNull:false
      },
      nombre_usuario: {
        type: Sequelize.STRING,
        allowNull:false,
        unique: true
      },
      mail: {
        type: Sequelize.STRING,
        allowNull:false,
        unique: true
      },
      contrasena: {
        type: Sequelize.STRING,
        allowNull:false
      },
      foto: {
        type: Sequelize.TEXT
      },
      tipo: {
        type: Sequelize.STRING
      },
      fundacion: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('User');
  }
};