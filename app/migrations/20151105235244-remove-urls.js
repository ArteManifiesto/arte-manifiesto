'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('Users', 'url');
    queryInterface.removeColumn('Works', 'url');
    queryInterface.removeColumn('Products', 'url');
    queryInterface.removeColumn('Collections', 'url');
  },
  down: function (queryInterface, Sequelize) {

  }
};
