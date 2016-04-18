'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.addIndex(
      'Products', ['name', 'description'], {
        indexName: 'ProductsFullText',
        indicesType: 'FULLTEXT'
      }
    );
  },

  down: function(queryInterface, Sequelize) {
    queryInterface.removeIndex('Products', 'ProductsFullText');
  }
};