const { Sequelize } = require('sequelize');
const sequelize = require('../utils/database')

class GenreSong extends Sequelize.Model {
    
}

GenreSong.init({
        id: {
            autoIncrement: true,
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true
        }
    },
    {sequelize, timestamps: false, modelName: 'genres_song'}
)

module.exports = GenreSong