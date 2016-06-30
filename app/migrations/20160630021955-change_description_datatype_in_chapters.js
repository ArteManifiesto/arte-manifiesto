'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.changeColumn(
      'Chapters',
      'description', {
        type: Sequelize.TEXT,
      }
    )
  },
  down: function(queryInterface, Sequelize) {
    queryInterface.changeColumn(
      'Chapters',
      'description', {
        type: Sequelize.STRING,
      }
    )
  }
};