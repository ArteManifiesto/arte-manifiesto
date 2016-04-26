'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.addColumn('Orders', 'data', {
      type: Sequelize.TEXT
    });
  },
  down: function(queryInterface, Sequelize) {
    queryInterface.removeColumn('Orders', 'data');
  }
};
