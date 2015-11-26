'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('Works', 'nswf', {
      type: Sequelize.BOOLEAN, defaultValue: false
    });
  },
  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('Works', 'nswf');
  }
};
