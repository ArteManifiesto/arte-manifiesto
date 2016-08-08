'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.addColumn('Users', 'dribbble', {
      type: Sequelize.STRING
    });
    queryInterface.addColumn('Users', 'instagram', {
      type: Sequelize.STRING
    });
  },
  down: function(queryInterface, Sequelize) {
    queryInterface.removeColumn('Users', 'dribbble');
    queryInterface.removeColumn('Users', 'instagram');
  }
};