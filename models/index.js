"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

const { user, pet, like, petPhoto, matching } = sequelize.models;

//user와 pet 관계설정
user.hasOne(pet, {
  foreignKey: "userId",
});
pet.belongsTo(user, {
  foreignKey: "userId",
});

//pet과 like 관계설정
pet.hasMany(like, {
  foreignKey: "petId",
});
like.belongsTo(pet, {
  foreignKey: "petId",
});

//pet과 matching 관계설정
pet.hasMany(matching, {
  foreignKey: "petId",
});
matching.belongsTo(pet, {
  foreignKey: "petId",
});

//pet과 userPhoto 관계설정
pet.hasMany(petPhoto, {
  foreignKey: "petId",
});
petPhoto.belongsTo(pet, {
  foreignKey: "petId",
});

module.exports = db;
