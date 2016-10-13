'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.renameColumn('Chapters', 'thumbnail', 'photo');
  },
  down: function(queryInterface, Sequelize) {
    queryInterface.renameColumn('Chapters', 'photo', 'thumbnail');
  }
};