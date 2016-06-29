'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.createTable(
      'Chapters', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: Sequelize.STRING,
        nameSlugify: Sequelize.STRING,
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
        video: Sequelize.STRING,
        title: Sequelize.STRING,
        description: Sequelize.STRING,
        views: Sequelize.INTEGER,
        published: Sequelize.BOOLEAN,
        releaseDate: Sequelize.DATE
      }
    );
  down: function(queryInterface, Sequelize) {
    queryInterface.dropTable('Chapters');
  }
};