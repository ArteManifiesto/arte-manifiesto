'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    var query = 'ALTER TABLE Reviews ADD CONSTRAINT reviews_ibfk_5 FOREIGN KEY (`ChapterId`) REFERENCES `Chapters` (`id`) ON DELETE CASCADE ON UPDATE CASCADE';

    return queryInterface.addColumn('Reviews', 'ChapterId', {
      type: Sequelize.INTEGER
    }).then(function() {
      console.log('lo cree papuuuuuu');
      return queryInterface.sequelize.query(query)
    });
  },
  down: function(queryInterface, Sequelize) {
    var query = 'ALTER TABLE Reviews DROP FOREIGN KEY reviews_ibfk_5';
    return queryInterface.sequelize.query(query).then(function() {
      return queryInterface.removeColumn('Reviews', 'ChapterId');
    });
  }
};