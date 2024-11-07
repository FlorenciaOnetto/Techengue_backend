'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('mascotas', 'detallesSalud', {
            type: Sequelize.TEXT,
            allowNull: true // o false, según lo que necesites
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('mascotas', 'detallesSalud');
    }
};
