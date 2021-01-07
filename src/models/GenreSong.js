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
        },
        // genreId: {
        //     type: Sequelize.INTEGER,
        //     allowNull: false,
        //     references: {model: 'genres', key: 'id'}
        //   },
        //   songId: {
        //     type: Sequelize.INTEGER,
        //     allowNull: false,
        //     references: {model: 'songs', key: 'id'}
        //   }
    },
    {sequelize, timestamps: false, modelName: 'genreSong'}
)

module.exports = GenreSong