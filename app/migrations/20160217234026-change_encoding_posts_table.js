'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    var query = 'ALTER TABLE Posts CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci';
    return queryInterface.sequelize.query(query);
  },
  down: function (queryInterface, Sequelize) {
    return;
  }
};
