'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('Categories', 'data', {type: Sequelize.TEXT});
  },
  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('Categories', 'data');
  }
};
