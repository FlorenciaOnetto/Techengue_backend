const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Resena = sequelize.define('Resena', {
    id_resena: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_adopcion: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Adopciones',
            key: 'id_adopcion'
        }
    },
    nota: DataTypes.INTEGER,
    descripcion: DataTypes.TEXT,
    created: DataTypes.DATE
}, {
    tableName: 'resenas',
    timestamps: false
});

Resena.associate = (models) => {
    Resena.belongsTo(models.Adopcion, { foreignKey: 'id_adopcion' });
};

module.exports = Resena;
