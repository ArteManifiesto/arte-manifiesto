'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.removeColumn('Chapters', 'hasContest');
    queryInterface.addColumn('Chapters', 'body', {
      type: Sequelize.TEXT
    });
  },
  down: function(queryInterface, Sequelize) {
    queryInterface.addColumn('Chapters', 'hasContest', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
    queryInterface.removeColumn('Chapters', 'body');
  }
};