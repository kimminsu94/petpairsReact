"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class pet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  pet.init(
    {
      userId: DataTypes.INTEGER,
      petName: DataTypes.STRING,
      breed: DataTypes.STRING,
      species: DataTypes.STRING,
      age: DataTypes.INTEGER,
      introduce: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "pet",
    }
  );
  return pet;
};
