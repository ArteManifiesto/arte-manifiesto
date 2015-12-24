'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('Posts', 'published', {
      type: Sequelize.BOOLEAN, defaultValue: false
    });
  },
  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('Posts', 'published');
  }
};
