'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('Products', 'config', {
      type: Sequelize.STRING
    });
    queryInterface.addColumn('Products', 'canvas', {
      type: Sequelize.STRING
    });
    queryInterface.addColumn('Products', 'isActive', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
  },
  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('Products', 'config');
    queryInterface.removeColumn('Products', 'canvas');
    queryInterface.removeColumn('Products', 'isActive');
  }
};
