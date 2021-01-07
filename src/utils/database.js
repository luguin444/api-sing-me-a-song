const { Sequelize } = require('sequelize');

const connectionString = process.env.DATABASE_URL;

const sequelize = new Sequelize(connectionString, { dialect: 'postgres'});

module.exports = sequelize;