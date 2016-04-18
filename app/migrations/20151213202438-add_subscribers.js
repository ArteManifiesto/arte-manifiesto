'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.createTable(
      'Subscribers', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        createdAt: {
          type: Sequelize.DATE
        },
        updatedAt: {
          type: Sequelize.DATE
        },
        email: Sequelize.STRING
      }
    )
  },

  down: function(queryInterface, Sequelize) {
    queryInterface.dropTable('Subscribers');
  }
};