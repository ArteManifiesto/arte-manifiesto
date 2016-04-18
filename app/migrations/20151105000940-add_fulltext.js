'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.addIndex(
      'Works', ['name', 'description'], {
        indexName: 'WorksFullText',
        indicesType: 'FULLTEXT'
      }
    );
  },

  down: function(queryInterface, Sequelize) {
    queryInterface.removeIndex('Works', 'WorksFullText');
  }
};