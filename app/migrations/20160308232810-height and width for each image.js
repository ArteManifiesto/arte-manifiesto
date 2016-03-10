'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('Works', 'oldPhoto', {
      type: Sequelize.STRING
    });

    queryInterface.addColumn('Works', 'width', {
      type: Sequelize.INTEGER
    });

    queryInterface.addColumn('Works', 'height', {
      type: Sequelize.INTEGER
    });

    queryInterface.addColumn('Works', 'backed', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
  },
  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('Works', 'oldPhoto');
    queryInterface.removeColumn('Works', 'width');
    queryInterface.removeColumn('Works', 'height');
    queryInterface.removeColumn('Works', 'backed');
  }
};
