'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    var query = 'ALTER TABLE Reviews ADD CONSTRAINT reviews_ibfk_4 FOREIGN KEY (`ProductId`) REFERENCES `Products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE';
    return queryInterface.addColumn('Reviews', 'ProductId', {
      type: Sequelize.INTEGER
    }).then(function() {
      return queryInterface.sequelize.query(query)
    });
  },
  down: function (queryInterface, Sequelize) {
    var query = 'ALTER TABLE Reviews DROP FOREIGN KEY reviews_ibfk_4';
    return queryInterface.sequelize.query(query).then(function() {
      return queryInterface.removeColumn('Reviews', 'ProductId');
    });
  }
};
