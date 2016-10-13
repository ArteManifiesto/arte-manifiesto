'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.addColumn('Chapters', 'thumbnail', {
      type: Sequelize.STRING
    });
    queryInterface.removeColumn('Chapters', 'title');
  },
  down: function(queryInterface, Sequelize) {
    queryInterface.removeColumn('Chapters', 'thumbnail');
    queryInterface.addColumn('Chapters', 'title', {
      type: Sequelize.STRING
    });
  }
};