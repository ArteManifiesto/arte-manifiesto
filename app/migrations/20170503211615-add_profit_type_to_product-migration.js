'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('Products', 'profit', {
      type: Sequelize.FLOAT
    });
    queryInterface.addColumn('Products', 'profitType', {
      type: Sequelize.INTEGER
    });
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('Products', 'profit');
    queryInterface.removeColumn('Products', 'profitType');
  }
};
