'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('Orders', 'shipping', {
      type: Sequelize.INTEGER
    });
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('Orders', 'shipping');
  }
};
