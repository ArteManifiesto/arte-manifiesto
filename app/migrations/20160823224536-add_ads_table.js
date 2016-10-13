'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.createTable(
      'Ads', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        views: Sequelize.STRING,
        clicks: Sequelize.INTEGER,
        AdPackId: {
          type: Sequelize.INTEGER,
          references: "AdPacks",
          referenceKey: "id",
          onUpdate: "CASCADE",
          onDelete: "CASCADE"
        },
        BrandId: {
          type: Sequelize.INTEGER,
          references: "Brands",
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
    queryInterface.dropTable('Ads');
  }
};