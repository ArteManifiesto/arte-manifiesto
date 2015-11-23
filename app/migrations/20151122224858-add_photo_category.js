'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('Categories', 'photo', {
      type: Sequelize.STRING
    });
  },
  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('Categories', 'photo');
  }
};
