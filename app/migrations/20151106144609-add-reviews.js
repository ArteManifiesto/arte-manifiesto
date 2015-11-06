'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable('Reviews',
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
      value: Sequelize.TEXT,
    },
    {
      engine: 'InnoDB',
      charset: 'utf8'
    });
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.dropTable('Reviews')
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
