'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('Works', 'onSale', {
      type: Sequelize.BOOLEAN, defaultValue: false
    });
  },
  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('Works', 'onSale');
  }
};
