const { Sequelize } = require('sequelize');
const sequelize = require('../utils/database');
const GenreSong = require('./GenreSong');

class Genre extends Sequelize.Model {
    
}

Genre.init({
        id: {
            autoIncrement: true,
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING(255),
            allowNull: false,
            unique: true
        } 
    },
    {sequelize, timestamps: false, modelName: 'genre'}
)

Genre.hasMany(GenreSong); //create genreId em GenreSong


module.exports = Genre