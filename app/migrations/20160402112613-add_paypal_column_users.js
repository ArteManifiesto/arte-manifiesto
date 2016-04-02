'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('Users', 'paypal', {type: Sequelize.STRING});
  },
  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('Users', 'paypal');
  }
};
