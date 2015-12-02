'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('Actions', 'seen', {
      type: Sequelize.BOOLEAN, defaultValue: false
    });
  },
  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('Actions', 'seen');
  }
};
