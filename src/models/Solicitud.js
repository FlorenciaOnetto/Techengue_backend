const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Mascota = require('./Mascota');

const Solicitud = sequelize.define('Solicitud', {
    id_solicitud: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_mascota: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Mascotas',
            key: 'id_mascota'
        }
    },
    id_potencial_adoptante: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Usuarios',
            key: 'id_usuario'
        }
    },
    estado: DataTypes.STRING,
    tipo_vivienda: DataTypes.TEXT,
    otra_mascota: DataTypes.BOOLEAN,
    experiencia: DataTypes.BOOLEAN,
    descripcion_experiencia: DataTypes.TEXT,
    razones: DataTypes.TEXT,
    contacto: DataTypes.STRING,    

}, {
    tableName: 'Solicitudes',
    timestamps: false
});

Solicitud.associate = (models) => {
    Solicitud.belongsTo(models.Mascota, { foreignKey: 'id_mascota', as: 'mascota' });
    Solicitud.belongsTo(models.Usuario, { foreignKey: 'id_potencial_adoptante', as: 'potencial_adoptante' });
};


module.exports = Solicitud;
