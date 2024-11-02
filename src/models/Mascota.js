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
    tamaño_aproximado: DataTypes.STRING,
    edad_aproximada: DataTypes.INTEGER,
    especie: DataTypes.STRING,
    raza: DataTypes.STRING,
    fotos: DataTypes.STRING,
    comportamiento: DataTypes.TEXT,
    salud: DataTypes.BOOLEAN,
    created: DataTypes.DATE
}, {
    tableName: 'mascotas',
    timestamps: false
});

Mascota.associate = (models) => {
    Mascota.belongsTo(models.Usuario, { foreignKey: 'id_usuario' });
    Mascota.hasMany(models.Solicitud, { foreignKey: 'id_mascota' });
};

module.exports = Mascota;
