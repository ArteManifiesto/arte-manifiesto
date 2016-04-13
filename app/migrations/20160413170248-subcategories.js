'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    var query = 'ALTER TABLE Categories ADD CONSTRAINT categories_ibfk_1 FOREIGN KEY (`ParentCategoryId`) REFERENCES `Categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE';

    return queryInterface.addColumn('Categories', 'ParentCategoryId', {
      type: Sequelize.INTEGER
    }).then(function() {
      return queryInterface.sequelize.query(query)
    });
  },
  down: function (queryInterface, Sequelize) {
    var query = 'ALTER TABLE Categories DROP FOREIGN KEY categories_ibfk_1';
    return queryInterface.sequelize.query(query).then(function() {
      return queryInterface.removeColumn('Categories', 'ParentCategoryId');
    });
  }
};
