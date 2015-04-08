process.env.NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * Load dependencies
 * ====================================================
 */
var express = require('express');
var utils = require('./config/utils');
var config = require('./config/config');
var db = require('./config/sequelize');
var passport = require('./config/passport');
var _ = require('lodash');

/**
 * configuration lodash
 */
_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

/**
 * Start APP
 * ====================================================
 */
var app = express();

/**
 * Initialize expres configuration
 * ====================================================
 */
require('./config/express')(app, passport);

/**
 * Run matches routes with controllers
 * ====================================================
 */
require('./config/routes').init(app);

/**
 * Run handlers errors
 * ====================================================
 */
require('./config/errors')(app);

/**
 * Run database and get up server
 * ====================================================
 */
app.set('port', process.env.PORT || config.port);

global.db = db;


var dev = !(process.env.NODE_ENV == 'production');
dev = false;
global.db.sequelize.sync({force: dev}).then(function () {
    if (dev) {
        var Chance = require('chance');
        var chance = new Chance();
        var i;

        var categoriesData = [];
        var tagsData = [];

        var promises = [];

        for (i = 0; i < 20; i++)
            categoriesData.push({name: chance.word()});

        for (i = 0; i < 20; i++)
            tagsData.push({name: chance.word()});

        promises.push(global.db.Category.bulkCreate(categoriesData));
        promises.push(global.db.Tag.bulkCreate(tagsData));

        for (i = 0; i < 20; i++) {
            promises.push(global.db.User.create({
                username: i == 0 ? 'juliocanares' : chance.twitter().replace('@', ''),
                email: i == 0 ? 'juliocanares@gmail.com' : chance.email(),
                firstname: i == 0 ? 'Julio César' : chance.first(),
                lastname: i == 0 ? 'Canares García' : chance.last(),
                gender: i == 0 ? 'Male' : chance.gender(),
                provider: 'local',
                photo: 'http://i.imgur.com/kVjGqJ7.png',
                isArtist: _.sample(_.shuffle([0, 1])),
                city: chance.city(),
                country: chance.country({full: true}),
                school: chance.name(),
                birthday: chance.birthday(),
                biography: chance.paragraph({sentences: 2})
            }));
        }

        /*
         var actionsData = [];

         for (i = 0; i < 20; i++)
         actionsData.push({meta: _.random(1, 2)})
         promises.push(global.db.Action.bulkCreate(actionsData));*/

        global.db.Sequelize.Promise.all(promises).then(function () {

        });
    }
    var server = app.listen(app.get('port'), function () {
        console.log('Express server listening on port', server.address().port);
    });
});

exports = module.exports = app;