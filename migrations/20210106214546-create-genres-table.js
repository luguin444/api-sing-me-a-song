'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.createTable('genres', {
	    id: {
	      type: Sequelize.INTEGER,
	      autoIncrement: true,
	      allowNull: false,
	      primaryKey: true
	    },
	    name: {
	      type: Sequelize.STRING(255),
		  allowNull: false,
		  unique: true
	    },
	  })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('genres');
  }
};
