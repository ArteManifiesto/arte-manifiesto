'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.removeIndex('Users', 'UsersFullText');
  },

  down: function (queryInterface, Sequelize) {
  }
};
