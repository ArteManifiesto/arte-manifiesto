'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      queryInterface.createTable(
        'Banners',
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          createdAt: {
            type: Sequelize.DATE
          },
          updatedAt: {
            type: Sequelize.DATE
          },
          name: Sequelize.STRING,
          image: Sequelize.STRING,
          link: Sequelize.STRING
        }
    )
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.dropTable('Banners');
  }
};
