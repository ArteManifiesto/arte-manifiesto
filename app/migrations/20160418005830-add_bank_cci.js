'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.addColumn('Users', 'bank', {
      type: Sequelize.STRING
    });
    queryInterface.addColumn('Users', 'cci', {
      type: Sequelize.STRING
    });
  },
  down: function(queryInterface, Sequelize) {
    queryInterface.removeColumn('Users', 'bank');
    queryInterface.removeColumn('Users', 'cci');
  }
};