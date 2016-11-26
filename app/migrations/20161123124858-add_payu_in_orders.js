'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.addColumn('Orders', 'signature', {
      type: Sequelize.STRING
    });
    queryInterface.addColumn('Orders', 'reference', {
      type: Sequelize.STRING
    });
  },
  down: function(queryInterface, Sequelize) {
    queryInterface.removeColumn('Orders', 'reference');
    queryInterface.removeColumn('Orders', 'signature');
  }
};
