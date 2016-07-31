'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.createTable(
      'Adds', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        title: Sequelize.STRING,
        description: Sequelize.STRING,
        photo: Sequelize.STRING,
        price: Sequelize.STRING,
        type: Sequelize.STRING,
        size: Sequelize.STRING,
        startDate: Sequelize.DATE,
        endDate: Sequelize.DATE,
        views: Sequelize.INTEGER,
        clicks: Sequelize.INTEGER,
        published: Sequelize.BOOLEAN,
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
        BrandId: {
          type: Sequelize.INTEGER,
          references: 'Brands',
          referenceKey: 'id',
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        }
      }
    );
  },
  down: function(queryInterface, Sequelize) {
    queryInterface.dropTable('Adds');
  }
};