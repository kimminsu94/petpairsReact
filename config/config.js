const dotenv = require("dotenv");
dotenv.config();

const config = {
  development: {
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    port: process.env.DATABASE_PORT,
    dialect: "mysql",
    logging: false,
    ssl: true,
  },
  test: {
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    port: process.env.DATABASE_PORT,
    dialect: "mysql",
    logging: false,
    ssl: true,
  },
  production: {
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    port: process.env.DATABASE_PORT,
    dialect: "mysql",
    logging: false,
    ssl: true,
  },
};

module.exports = config;
