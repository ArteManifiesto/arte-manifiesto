'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.createTable(
      'Posts', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: Sequelize.STRING,
        nameSlugify: Sequelize.STRING,
        photo: Sequelize.STRING,
        description: Sequelize.TEXT,
        body: Sequelize.TEXT,
        createdAt: {
          type: Sequelize.DATE
        },
        updatedAt: {
          type: Sequelize.DATE
        },
        published: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
        featured: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
        views: {
          type: Sequelize.INTEGER,
          defaultValue: 0
        },
        popularity: {
          type: Sequelize.INTEGER,
          defaultValue: 0
        },
        UserId: {
          type: Sequelize.INTEGER,
          references: "Users",
          referenceKey: "id",
          onUpdate: "CASCADE",
          onDelete: "CASCADE"
        },
        CategoryId: {
          type: Sequelize.INTEGER,
          references: "Categories",
          referenceKey: "id",
          onUpdate: "CASCADE",
          onDelete: "CASCADE"
        }
      }
    )
  },

  down: function(queryInterface, Sequelize) {
    queryInterface.dropTable('Posts');
  }
};