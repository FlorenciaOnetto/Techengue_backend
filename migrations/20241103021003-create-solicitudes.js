'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Solicitudes', {
      id_solicitud: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      id_mascota: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Mascotas', // Asegúrate de que el nombre coincida con el de la tabla Mascotas
          key: 'id_mascota'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      id_potencial_adoptante: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Usuarios', // Asegúrate de que el nombre coincida con el de la tabla Usuarios
          key: 'id_usuario'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      estado: {
        type: Sequelize.STRING,
        allowNull: true
      },
      tipo_vivienda: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      otra_mascota: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      experiencia: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      descripcion_experiencia: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      razones: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      contacto: {
        type: Sequelize.STRING,
        allowNull: true
      }
      // No incluimos createdAt y updatedAt porque timestamps: false en el modelo
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Solicitudes');
  }
};

