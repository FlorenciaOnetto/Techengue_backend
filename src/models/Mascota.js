const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Solicitud = require('./Solicitud'); // Asegurarse de que Solicitud esté correctamente importado

const Mascota = sequelize.define('Mascota', {
    id_mascota: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Usuarios', 
            key: 'id_usuario'
        }
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tamano_aproximado: DataTypes.STRING,
    edad_aproximada: DataTypes.INTEGER,
    edad_unidad: DataTypes.STRING,
    especie: DataTypes.STRING,
    raza: DataTypes.STRING,
    fotos: DataTypes.STRING,
    comportamiento: DataTypes.TEXT,
    salud: DataTypes.BOOLEAN,
    region: DataTypes.STRING,
    detallesSalud: DataTypes.TEXT,
    created: DataTypes.DATE
}, {
    tableName: 'Mascotas',
    timestamps: false
});

Mascota.associate = (models) => {
    Mascota.belongsTo(models.Usuario, { foreignKey: 'id_usuario' });
    Mascota.hasMany(models.Solicitud, { foreignKey: 'id_mascota', as: 'solicitudes' });
};

module.exports = Mascota;
