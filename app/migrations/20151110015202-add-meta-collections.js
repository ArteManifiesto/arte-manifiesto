'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('Collections', 'meta', {
      type: Sequelize.STRING, defaultValue: 'work'
    });
  },
  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('Collections', 'meta');
  }
};
