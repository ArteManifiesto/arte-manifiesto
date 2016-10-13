'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.dropTable('Ads');
    queryInterface.dropTable('Brands');
  },

  down: function(queryInterface, Sequelize) {}
};