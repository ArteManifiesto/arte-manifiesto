'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.createTable(
      'Alerts', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: Sequelize.STRING,
        background: Sequelize.STRING,
        text: Sequelize.STRING,
        buttonText: Sequelize.STRING,
        buttonColor: Sequelize.STRING,
        buttonLink: Sequelize.STRING,
        isActive: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
        createdAt: {
          type: Sequelize.DATE
        },
        updatedAt: {
          type: Sequelize.DATE
        }
      }
    );
  },

  down: function(queryInterface, Sequelize) {
    queryInterface.dropTable('Alerts');
  }
};