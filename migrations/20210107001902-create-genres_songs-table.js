'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('genres_songs', {
	    id: {
	      type: Sequelize.INTEGER,
	      autoIncrement: true,
	      allowNull: false,
	      primaryKey: true
	    },
      genreId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'genres', key: 'id'}
      },
      songId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'songs', key: 'id'}
      }
	  })
  },

  down: async (queryInterface, Sequelize) => {
      queryInterface.dropTable('genres_songs')
  }
};
