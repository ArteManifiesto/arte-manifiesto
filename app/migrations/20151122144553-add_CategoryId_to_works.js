'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('Works', 'CategoryId', {
      type: Sequelize.INTEGER,
      references: "Categories",
      referenceKey: "id",
      onUpdate: "CASCADE",
      onDelete: "CASCADE"
    });
  },
  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('Works', 'CategoryId');
  }
};
