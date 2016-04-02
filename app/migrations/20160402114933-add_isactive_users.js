'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('Users', 'isActive', {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    });
  },
  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('Users', 'isActive');
  }
};
