'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    var query = 'ALTER TABLE Products MODIFY config TEXT;';
    var query2 = 'ALTER TABLE Products MODIFY canvas TEXT;';
    return queryInterface.sequelize.query(query).then(function() {
      return queryInterface.sequelize.query(query2)
    });
  },
  down: function(queryInterface, Sequelize) {
    var query = 'ALTER TABLE Products MODIFY config STRING;';
    var query2 = 'ALTER TABLE Products MODIFY canvas STRING;';
    return queryInterface.sequelize.query(query).then(function() {
      return queryInterface.sequelize.query(query2)
    });
  }
};
