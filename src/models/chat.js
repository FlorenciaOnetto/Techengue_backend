'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    static associate(models) {
      // Asociación al Usuario1
      this.belongsTo(models.Voluntario, {
        foreignKey: 'id',
        as: 'Usuario1',
      });

      // Asociación al Usuario2
      this.belongsTo(models.Fundacion, {
        foreignKey: 'id',
        as: 'Usuario2',
      });
    }
  }
  Chat.init({
    FechaInicio: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Chat',
    freezeTableName: true,
  });
  return Chat;
};
