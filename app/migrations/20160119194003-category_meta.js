'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('Categories', 'meta', {
      type: Sequelize.INTEGER, defaultValue: 0
    });
  },
  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('Categories', 'meta');
  }
};
