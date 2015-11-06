'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('Reviews', 'WorkId', {
      type: Sequelize.INTEGER
    });
  },
  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('Reviews', 'WorkId');
  }
};
