const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Adopcion = sequelize.define('Adopcion', {
    id_adopcion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_solicitud: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Solicitudes',
            key: 'id_solicitud'
        }
    },
    created: DataTypes.DATE
}, {
    tableName: 'Adopciones',
    timestamps: false
});

Adopcion.associate = (models) => {
    Adopcion.belongsTo(models.Solicitud, { foreignKey: 'id_solicitud' });
    Adopcion.hasOne(models.Resena, { foreignKey: 'id_adopcion' });
};

module.exports = Adopcion;
