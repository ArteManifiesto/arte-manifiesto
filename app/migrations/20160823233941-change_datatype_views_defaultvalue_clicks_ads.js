'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.changeColumn('Ads',
      'views', {
        type: Sequelize.INTEGER,
        defaultValue: 0
      }
    );

    queryInterface.changeColumn('Ads',
      'clicks', {
        type: Sequelize.INTEGER,
        defaultValue: 0
      }
    );
  },
  down: function(queryInterface, Sequelize) {
    queryInterface.changeColumn('Ads',
      'views', {
        type: Sequelize.STRING
      }
    );

    queryInterface.changeColumn('Ads',
      'clicks', {
        type: Sequelize.INTEGER
      }
    );
  }
};