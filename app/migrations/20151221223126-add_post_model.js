'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable(
      'Posts',
      {
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
        UserId: {
          type: Sequelize.INTEGER,
          references: "Users",
          referenceKey: "id",
          onUpdate: "CASCADE",
          onDelete: "CASCADE"
        }
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.dropTable('Posts');
  }
};
