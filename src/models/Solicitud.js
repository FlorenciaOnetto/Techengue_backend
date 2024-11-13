const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Solicitud = sequelize.define('Solicitud', {
    id_solicitud: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_mascota: {
        type: DataTypes.INTEGER,
        references: {
            model: 'mascotas',
            key: 'id_mascota'
        }
    },
    id_potencial_adoptante: {
        type: DataTypes.INTEGER,
        references: {
            model: 'usuarios',
            key: 'id_usuario'
        }
    },
    estado: DataTypes.STRING,
    razones: DataTypes.TEXT,
    descripcion_hogar: DataTypes.TEXT,
    experiencia: DataTypes.BOOLEAN,
    contacto: DataTypes.STRING,
    created: DataTypes.DATE
}, {
    tableName: 'Solicitudes',
    timestamps: false
});

Solicitud.associate = (models) => {
    Solicitud.belongsTo(models.Mascota, { foreignKey: 'id_mascota' });
    Solicitud.belongsTo(models.Usuario, { foreignKey: 'id_potencial_adoptante' });
    Solicitud.hasOne(models.Adopcion, { foreignKey: 'id_solicitud' });
    Solicitud.hasOne(models.Chat, { foreignKey: 'id_solicitud' });
};

module.exports = Solicitud;
