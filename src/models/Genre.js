const { Sequelize } = require('sequelize');
const sequelize = require('../utils/database')

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

module.exports = Genre