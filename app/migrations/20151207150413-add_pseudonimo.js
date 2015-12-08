'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('Users', 'pseudonimo', {
      type: Sequelize.STRING
    });
    queryInterface.addColumn('Users', 'typeName', {
      type: Sequelize.INTEGER, defaultValue: 1
    });
  },
  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('Users', 'pseudonimo');
    queryInterface.removeColumn('Users', 'typeName');
  }
};
