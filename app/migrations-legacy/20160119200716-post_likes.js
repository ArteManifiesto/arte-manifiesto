'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.createTable(
      'PostLikes', {
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
        },
        PostId: {
          type: Sequelize.INTEGER,
          references: "Posts",
          referenceKey: "id",
          onUpdate: "CASCADE",
          onDelete: "CASCADE"
        }
      }
    )
  },

  down: function(queryInterface, Sequelize) {
    queryInterface.dropTable('PostLikes');
  }
};