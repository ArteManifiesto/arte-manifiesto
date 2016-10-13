'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.addColumn('Chapters', 'hasContest', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
  },
  down: function(queryInterface, Sequelize) {
    queryInterface.removeColumn('Chapters', 'hasContest');
  }
};