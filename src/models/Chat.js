const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Chat = sequelize.define('Chat', {
    id_chat: {
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
    }
}, {
    tableName: 'chats',
    timestamps: false
});

Chat.associate = (models) => {
    Chat.belongsTo(models.Solicitud, { foreignKey: 'id_solicitud' });
    Chat.hasMany(models.Mensaje, { foreignKey: 'id_chat' });
};

module.exports = Chat;
