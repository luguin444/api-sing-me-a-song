const { Sequelize } = require('sequelize');
const sequelize = require('../utils/database');
const Genre = require('./Genre');
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
Song.belongsToMany( Genre , { through: GenreSong });  //pegar os generos dentro da de Song com includes relacionamento n:m


module.exports = Song