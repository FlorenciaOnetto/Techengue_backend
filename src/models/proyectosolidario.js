'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProyectoSolidario extends Model {
    static associate(models) {
      // Asociación a Fundación
      this.belongsTo(models.Fundacion, {
        foreignKey: 'id',
        as: 'Fundacion',
      });

      // Asociación a Reseñas
      this.hasMany(models.Resena, {
        foreignKey: 'id',
        as: 'Resenas',
      });
    }
  }
  ProyectoSolidario.init({
    titulo: DataTypes.STRING,
    descripcion: DataTypes.TEXT,
    fecha_inicio: DataTypes.DATE,
    fecha_finalizacion: DataTypes.DATE,
    objetivos: DataTypes.STRING,
    categoria: DataTypes.STRING,
    proyect_userId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ProyectoSolidario',
    freezeTableName: true,
  });
  return ProyectoSolidario;
};