'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Publicacion extends Model {
    static associate(models) {
      // Definir la relación con ProyectoSolidario a través de proyectoID
      this.belongsTo(models.ProyectoSolidario, {
        foreignKey: 'id',
        as: 'Proyecto',
      });
    }
  }
  Publicacion.init({
    contenido: DataTypes.TEXT,
    fecha_publicacion: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Publicacion',
    freezeTableName: true,
  });
  return Publicacion;
};
