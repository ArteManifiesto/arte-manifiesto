'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.addColumn('Ads', 'photo', {
      type: Sequelize.STRING
    });
    queryInterface.addColumn('Ads', 'description', {
      type: Sequelize.STRING
    });
    queryInterface.addColumn('Ads', 'link', {
      type: Sequelize.STRING
    });
  },
  down: function(queryInterface, Sequelize) {
    queryInterface.removeColumn('Ads', 'photo');
    queryInterface.removeColumn('Ads', 'description');
    queryInterface.removeColumn('Ads', 'link');
  }
};