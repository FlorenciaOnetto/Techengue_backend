const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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
    detallesSalud: DataTypes.TEXT, // Agrega este campo para detalles de salud
    created: DataTypes.DATE
}, {
    tableName: 'Mascotas',
    timestamps: false
});

Mascota.associate = (models) => {
    Mascota.belongsTo(models.Usuario, { foreignKey: 'id_usuario' });
    Mascota.hasMany(models.Solicitud, { foreignKey: 'id_mascota', as: 'Solicitudes' });
};

module.exports = Mascota;
