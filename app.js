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


        global.db.Sequelize.Promise.all(promises).then(function () {
            promises = [];
            var products = ['prints', 'tazas', 'polos', 'carteras', 'gorras', 'tatuajes'];
            for (var j = 0; j < products.length; j++) {
                var product = products[j];
                promises.push(global.db.ProductType.create({name: product}));
            }


            for (i = 0; i < 20; i++) {
                promises.push(global.db.User.create({
                    username: i == 0 ? 'juliocanares' : chance.twitter().replace('@', ''),
                    email: i == 0 ? 'juliocanares@gmail.com' : chance.email(),
                    firstname: i == 0 ? 'Julio César' : chance.first(),
                    lastname: i == 0 ? 'Canares García' : chance.last(),
                    gender: i == 0 ? 'Male' : chance.gender(),
                    provider: 'local',
                    photo: '/img/artists/artist' + (_.random(1, 4).toString()) + '.jpg',
                    isArtist: _.sample(_.shuffle([0, 1])),
                    city: chance.city(),
                    country: chance.country({full: true}),
                    school: chance.name(),
                    birthday: chance.birthday(),
                    biography: chance.paragraph({sentences: 2})
                }));
            }

            global.db.Sequelize.Promise.all(promises).then(function () {
            });
        });
    }
    var server = app.listen(app.get('port'), function () {
        console.log('Express server listening on port', server.address().port);
    });
});

exports = module.exports = app;