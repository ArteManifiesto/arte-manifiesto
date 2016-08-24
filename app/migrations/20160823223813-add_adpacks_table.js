'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.createTable(
      'AdPacks', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: Sequelize.STRING,
        startDate: Sequelize.DATE,
        endDate: Sequelize.DATE,
        isActive: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
        BrandId: {
          type: Sequelize.INTEGER,
          references: "Brands",
          referenceKey: "id",
          onUpdate: "CASCADE",
          onDelete: "CASCADE"
        },
        AdPackTypeId: {
          type: Sequelize.INTEGER,
          references: "AdPackTypes",
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
    queryInterface.dropTable('AdPacks');
  }
};