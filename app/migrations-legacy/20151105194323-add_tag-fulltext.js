'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.addIndex(
      'Tags', ['name'], {
        indexName: 'TagsFullText',
        indicesType: 'FULLTEXT'
      }
    );
  },

  down: function(queryInterface, Sequelize) {
    queryInterface.removeIndex('Tags', 'TagsFullText');
  }
};