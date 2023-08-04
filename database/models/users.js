"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Users.init(
    {
      userid: DataTypes.STRING(25),
      email: DataTypes.STRING(50),
      password: DataTypes.STRING(255),
      username: DataTypes.STRING(255),
      userimage: DataTypes.STRING(255),
      status: DataTypes.TINYINT,
    },
    {
      sequelize,
      modelName: "Users",
      tableName: "users",
    }
  );
  return Users;
};
