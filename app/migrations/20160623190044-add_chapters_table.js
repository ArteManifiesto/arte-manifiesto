'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.createTable(
      'Chapters', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        createdAt: {
          type: Sequelize.DATE
        },
        updatedAt: {
          type: Sequelize.DATE
        },
        video: Sequelize.STRING
      }
    )
  },

  down: function(queryInterface, Sequelize) {
    queryInterface.dropTable('Chapters');
  }
};