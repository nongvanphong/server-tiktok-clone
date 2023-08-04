"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Favourites extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Favourites.init(
    {
      userid: DataTypes.INTEGER,
      videoid: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Favourites",
      tableName: "favourites",
    }
  );
  return Favourites;
};
