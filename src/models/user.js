'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.Voluntario, { foreignKey: 'id'})
      this.hasOne(models.Fundacion, {foreignKey: 'id'})
    }
  }
  User.init({
    nombre: DataTypes.STRING,
    tipo: DataTypes.STRING,
    nombre_usuario: {
      type: DataTypes.STRING,
    },
    mail: {
      type: DataTypes.STRING,
      validate: {
        isEmail:{
          msg: 'El correo debe tener formato de mail.'
        }
      },
    },
    contrasena: DataTypes.STRING,
    foto: DataTypes.TEXT,
    fundacion: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    freezeTableName: true,
  });
  return User;
};