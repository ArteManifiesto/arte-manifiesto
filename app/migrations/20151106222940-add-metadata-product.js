'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    var defaultValue = {type: Sequelize.INTEGER};
    queryInterface.addColumn('Products', 'width', defaultValue);
    queryInterface.addColumn('Products', 'length', defaultValue);
    queryInterface.addColumn('Products', 'depth', defaultValue);
    queryInterface.addColumn('Products', 'weight', defaultValue);
  },
  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('Products', 'width');
    queryInterface.removeColumn('Products', 'length');
    queryInterface.removeColumn('Products', 'depth');
    queryInterface.removeColumn('Products', 'weight');
  }
};
