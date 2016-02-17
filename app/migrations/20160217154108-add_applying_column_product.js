'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('Products', 'applying', {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    });
  },
  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('Products', 'applying');
  }
};
