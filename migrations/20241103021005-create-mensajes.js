// migrations/YYYYMMDDHHMMSS-create-mensajes.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Mensajes', {
      id_mensaje: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      id_chat: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Chats', // Asegúrate de que el modelo se haya creado antes
          key: 'id_chat',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      contenido: Sequelize.TEXT,
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
    await queryInterface.dropTable('Mensajes');
  }
};
