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
            model: 'usuarios', 
            key: 'id'
        }
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tamano_aproximado: DataTypes.STRING,
    edad_aproximada: DataTypes.INTEGER, // Almacena el valor numérico de la edad
    edad_unidad: DataTypes.STRING,       // Almacena "meses" o "años"
    especie: DataTypes.STRING,
    raza: DataTypes.STRING,
    fotos: DataTypes.STRING,
    comportamiento: DataTypes.TEXT,
    salud: DataTypes.BOOLEAN,
    region: DataTypes.STRING,
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
