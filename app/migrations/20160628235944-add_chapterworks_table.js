'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.createTable(
      'ChapterWorks', {
        ChapterId: {
          type: Sequelize.INTEGER,
          references: "Chapters",
          referenceKey: "id",
          onUpdate: "CASCADE",
          onDelete: "CASCADE"
        },
        WorkId: {
          type: Sequelize.INTEGER,
          references: "Works",
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
    queryInterface.dropTable('UserContestsTv');
  }
};