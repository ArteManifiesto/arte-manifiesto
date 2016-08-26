'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.createTable(
      'AdPackTypeAdTypes', {
        AdPackTypeId: {
          type: Sequelize.INTEGER,
          references: "AdPackTypes",
          referenceKey: "id",
          onUpdate: "CASCADE",
          onDelete: "CASCADE"
        },
        AdTypeId: {
          type: Sequelize.INTEGER,
          references: "AdTypes",
          referenceKey: "id",
          onUpdate: "CASCADE",
          onDelete: "CASCADE"
        },
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE
      }
    );
  },

  down: function(queryInterface, Sequelize) {
    queryInterface.dropTable('AdPackTypeAdTypes');
  }
};