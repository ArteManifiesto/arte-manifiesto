'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('Products', 'finalPrice', {
      type: Sequelize.INTEGER
    });
  },
  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('Products', 'finalPrice');
  }
};
