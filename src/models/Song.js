const { Sequelize } = require('sequelize');
const sequelize = require('../utils/database');
const GenreSong = require('./GenreSong');

class Song extends Sequelize.Model {
    
}

Song.init({
        id: {
            autoIncrement: true,
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING(255),
            allowNull: false,
        },
        youtubeLink: {
            type: Sequelize.STRING(255),
            allowNull: false,
        },
        score: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        }     
    },
    {sequelize, timestamps: false, modelName: 'song'}
)

Song.hasMany(GenreSong);  //create songId em GenreSong


module.exports = Song