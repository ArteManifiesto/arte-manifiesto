'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addIndex(
      'Collections',
      ['name', 'description'],
      {
        indexName: 'CollectionsFullText',
        indicesType: 'FULLTEXT'
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeIndex('Collections', 'CollectionsFullText');
  }
};
