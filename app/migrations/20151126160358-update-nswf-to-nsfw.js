'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.renameColumn('Works', 'nswf', 'nsfw');
  },
  down: function (queryInterface, Sequelize) {
    queryInterface.renameColumn('Works', 'nsfw', 'nswf');
  }
};
