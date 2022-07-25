const { DataTypes, Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const db = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  logging: false,
  database: 'academloMealsDB',
});

//FALTAN CONFIGURACIONES PARA HEROKU

module.exports = { DataTypes, db };
