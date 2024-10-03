'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Fundacion extends Model {
    static associate(models) {
      // Asociación a Reseñas
      this.hasMany(models.Resena, {
        foreignKey: 'id',
        as: 'Resenas',
      });

      // Asociación a Proyectos Solidarios
      this.hasMany(models.ProyectoSolidario, {
        foreignKey: 'id',
        as: 'ProyectosSolidarios',
      });

      // Herencia de Usuario
      this.belongsTo(models.User, {
        foreignKey: 'id'
      });
    }
  }
  Fundacion.init({
    user_id: DataTypes.INTEGER,
    descripcion: DataTypes.TEXT,
    contacto: DataTypes.STRING,
    sitio_web: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Fundacion',
    freezeTableName: true,
  });
  return Fundacion;
};
