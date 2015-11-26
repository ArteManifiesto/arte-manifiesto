'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('Users', 'age', {
      type: Sequelize.INTEGER
    });
  },
  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('Users', 'age');
  }
};
