"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Commets extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Commets.belongsTo(models.Users, { foreignKey: "userid" });
    }
  }
  Commets.init(
    {
      userid: DataTypes.INTEGER,
      videoid: DataTypes.INTEGER,
      messenger: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Commets",
      tableName: "commets",
    }
  );
  return Commets;
};
