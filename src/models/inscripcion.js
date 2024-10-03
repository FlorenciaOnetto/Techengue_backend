'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Inscripcion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Inscripcion.init({
    id_usuario: DataTypes.INTEGER,
    id_proyecto: DataTypes.INTEGER,
    mensaje: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Inscripcion',
  });
  return Inscripcion;
};