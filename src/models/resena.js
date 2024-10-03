'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Resena extends Model {
    static associate(models) {
      // Relación con Voluntario (usuarioID)
      this.belongsTo(models.Voluntario, {
        foreignKey: 'id',
        as: 'Voluntario',
      });

      // Relación con ProyectoSolidario (proyectoID)
      this.belongsTo(models.ProyectoSolidario, {
        foreignKey: 'id',
        as: 'ProyectoSolidario',
      });

    }
  }
  Resena.init({
    contenido: DataTypes.TEXT,
    calificacion: DataTypes.INTEGER,
    fecha_resena: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Resena',
    freezeTableName: true,
  });
  return Resena;
};
