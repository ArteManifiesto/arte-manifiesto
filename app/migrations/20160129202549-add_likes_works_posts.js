'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('Works', 'likes', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    });
    queryInterface.addColumn('Posts', 'likes', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    });
  },
  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('Works', 'likes');
    queryInterface.removeColumn('Posts', 'likes');
  }
};
