'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable('ProductTags',
    {
      ProductId: {
        type: Sequelize.INTEGER,
        references: "Products",
        referenceKey: "id",
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      TagId: {
        type: Sequelize.INTEGER,
        references: "Tags",
        referenceKey: "id",
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      }
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    },
    {
      engine: 'InnoDB',
      charset: 'utf8'
    });
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.dropTable('ProductTags')
  }
};
