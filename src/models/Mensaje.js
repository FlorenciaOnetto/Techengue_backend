const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Mensaje = sequelize.define('Mensaje', {
    id_mensaje: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_chat: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Chats',
            key: 'id_chat'
        }
    },
    contenido: DataTypes.TEXT
}, {
    tableName: 'mensajes',
    timestamps: false
});

Mensaje.associate = (models) => {
    Mensaje.belongsTo(models.Chat, { foreignKey: 'id_chat' });
};

module.exports = Mensaje;
