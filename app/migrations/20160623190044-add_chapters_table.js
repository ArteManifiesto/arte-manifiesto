'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.createTable(
      'Chapters', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        createdAt: {
          type: Sequelize.DATE
        },
        updatedAt: {
          type: Sequelize.DATE
        },
        video: Sequelize.STRING,
        titulo: Sequelize.STRING,
        descripcion: Sequelize.STRING
      }
    );
    queryInterface.bulkInsert('Chapters', [
      { video: "https://www.youtube.com/embed/-4j7WQ1Sogg", 
      titulo: "capitulo1", 
      descripcion: "esta es una descripcion de prueba", 
      createdAt: Date.now(), 
      updatedAt: Date.now() },
      { video: "https://www.youtube.com/embed/-4j7WQ1Sogg", 
      titulo: "capitulo2", 
      descripcion: "esta es una descripcion de prueba", 
      createdAt: Date.now(), 
      updatedAt: Date.now() },
      { video: "https://www.youtube.com/embed/-4j7WQ1Sogg", 
      titulo: "capitulo3", 
      descripcion: "esta es una descripcion de prueba", 
      createdAt: Date.now(), 
      updatedAt: Date.now() },
      { video: "https://www.youtube.com/embed/-4j7WQ1Sogg", 
      titulo: "capitulo4", 
      descripcion: "esta es una descripcion de prueba", 
      createdAt: Date.now(), 
      updatedAt: Date.now() }
    ]);
  },

  down: function(queryInterface, Sequelize) {
    queryInterface.dropTable('Chapters');
  }
};