'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('Users', 'isSeller', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });

    queryInterface.addColumn('Users', 'province', {type: Sequelize.STRING});
    queryInterface.addColumn('Users', 'zipcode', {type: Sequelize.STRING});
    queryInterface.addColumn('Users', 'direction', {type: Sequelize.STRING});
    queryInterface.addColumn('Users', 'phone', {type: Sequelize.STRING});
    queryInterface.addColumn('Users', 'document', {type: Sequelize.STRING});
    queryInterface.addColumn('Users', 'documentValue', {type: Sequelize.STRING});
    queryInterface.addColumn('Users', 'businessName', {type: Sequelize.STRING});
  },
  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('Users', 'isSeller');
    queryInterface.removeColumn('Users', 'province');
    queryInterface.removeColumn('Users', 'zipcode');
    queryInterface.removeColumn('Users', 'direction');
    queryInterface.removeColumn('Users', 'phone');
    queryInterface.removeColumn('Users', 'document');
    queryInterface.removeColumn('Users', 'documentValue');
    queryInterface.removeColumn('Users', 'businessName');
  }
};
