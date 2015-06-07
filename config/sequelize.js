/**
 * Load dependencies
 * ====================================================
 */
var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var config = require('./config');
var _ = require('lodash');

/**
 * Configuration connection database
 * ====================================================
 */
var sequelize;
if (process.env.NODE_ENV == 'production') {
    sequelize = new Sequelize('heroku_082ce63f99d3d82', 'be72f71bb5432f', '520f5767', {
        dialect: 'mysql',
        protocol: 'mysql',
        port: '3306',
        host: 'us-cdbr-iron-east-02.cleardb.net',
        timezone: '-05:00'
    });
} else {
    sequelize = new Sequelize(config.db.name, config.db.username, config.db.password, {
        dialect: config.db.dialect,
        timezone: '-05:00'
    });
}

/**
 * Load all files in models folder
 * ====================================================
 */
var db = {};
fs.readdirSync(config.modelsDir)
    .filter(function (file) {
        return (file.indexOf('.') !== 0) && (file !== 'index.js')
    })
    .forEach(function (file) {
        var model = sequelize.import(path.join(config.modelsDir, file));
        db[model.name] = model;
    });

/**
 * Invoke all association on each of the models
 * ====================================================
 */
Object.keys(db).forEach(function (modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});

/**
 * Assign the sequelize variable to db object
 * ====================================================
 */
module.exports = _.extend({
    sequelize: sequelize,
    Sequelize: Sequelize
}, db);