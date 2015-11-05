'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addIndex(
      'Users',
      ['firstname', 'lastname', 'username'],
      {
        indexName: 'UsersFullText',
        indicesType: 'FULLTEXT'
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeIndex('Users', 'UsersFullText');
  }
};
