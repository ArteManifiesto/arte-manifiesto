'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable('WorkRequests',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      UserId: {
        type: Sequelize.INTEGER,
        references: "Users",
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
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    },
    {
      engine: 'InnoDB',
      charset: 'utf8'
    });
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.dropTable('WorkRequests')
  }
};
