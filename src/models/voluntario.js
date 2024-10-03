'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Voluntario extends Model {
    static associate(models) {
      // Relación con Resena (uno a muchos)
      this.hasMany(models.Resena, {
        foreignKey: 'id', // Nombre de la clave foránea en la tabla Resena
        as: 'Resenas', // Alias para la relación
      });

      // Relación con ProyectoSolidario (uno a muchos)
      this.hasMany(models.ProyectoSolidario, {
        foreignKey: 'id', // Nombre de la clave foránea en la tabla ProyectoSolidario
        as: 'ProyectosSolidarios', // Alias para la relación
      });

      // Herencia de Usuario
      this.belongsTo(models.User, {
        foreignKey: 'id',
        as: 'Usuario',
      });
    }
  }
  Voluntario.init(
    {

      horas_acumuladas: DataTypes.INTEGER,

    },
    {
      sequelize,
      modelName: 'Voluntario',
      // Definir el nombre de la tabla en la base de datos
      tableName: 'Voluntario',
      freezeTableName: true,
    }
  );
  return Voluntario;
};
