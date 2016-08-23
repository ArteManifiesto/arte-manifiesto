'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.dropTable('UserContestsTv');
    queryInterface.dropTable('ChapterWorks');
  },

  down: function (queryInterface, Sequelize) {
  }
};
