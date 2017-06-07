'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('Collections', 'cover', {
      type: Sequelize.STRING
    });
  },

  down: function (queryInterface, Sequelize) {
     queryInterface.removeColumn('Collections', 'cover');
  }
};
