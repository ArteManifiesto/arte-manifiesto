'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    var query = 'ALTER TABLE Reviews ADD CONSTRAINT reviews_ibfk_3 FOREIGN KEY (`PostId`) REFERENCES `Posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE';

    return queryInterface.addColumn('Reviews', 'PostId', {
      type: Sequelize.INTEGER
    }).then(function() {
      return queryInterface.sequelize.query(query)
    });
  },
  down: function (queryInterface, Sequelize) {
    var query = 'ALTER TABLE Reviews DROP FOREIGN KEY reviews_ibfk_3';
    return queryInterface.sequelize.query(query).then(function() {
      return queryInterface.removeColumn('Reviews', 'PostId');
    });
  }
};
