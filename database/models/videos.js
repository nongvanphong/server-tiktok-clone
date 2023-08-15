"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Videos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Videos.belongsTo(models.Users, { foreignKey: "userid" });
      Videos.hasMany(models.Favourites, { foreignKey: "id" });
      // Videos.belongsTo(models.Commets, { foreignKey: "videoid" });
    }
  }
  Videos.init(
    {
      userid: DataTypes.INTEGER,
      videotag: DataTypes.STRING(50),
      videotitle: DataTypes.STRING(255),
      videodescrible: DataTypes.STRING(255),
      videouri: DataTypes.STRING(255),
      status: DataTypes.TINYINT(2),
    },
    {
      sequelize,
      modelName: "Videos",
      tableName: "videos",
    }
  );
  return Videos;
};
