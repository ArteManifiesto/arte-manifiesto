'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('Users', 'age');
  },
  down: function (queryInterface, Sequelize) {
  }
};
