'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.addColumn('Chapters', 'trailer', {
      type: Sequelize.STRING
    });
  },
  down: function(queryInterface, Sequelize) {
    queryInterface.removeColumn('Chapters', 'trailer');
  }
};