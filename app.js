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
var open = require("open");
/**
 * configuration lodash
 */

/**
 * Start APP
 * ====================================================
 */
var app = express();

require('json-response');

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

var dev = process.env.NODE_RESTART;

global.db.sequelize.sync({force: dev}).then(function () {
    var serverHandler = function () {
        var server = app.listen(app.get('port'), function () {
            var url = 'http://127.0.0.1:' + server.address().port + '/auth/login';
            console.log('Express server listening  on ' + url);
            //open(url);
        });
    }
    if (dev) {
        var Chance = require('chance');
        var chance = new Chance();
        var i;
        var categoriesData = [
            {name: 'Arte Urbano'}, {name: 'Collage'}, {name: 'Dibujo'},
            {name: 'Fotografía'}, {name: 'Grabado'}, {name: 'Ilustración'},
            {name: 'Instalación'}, {name: 'Pintura'}, {name: 'Técnica Mixta'},
            {name: 'Digital'}, {name: 'Escultura'}
        ];
        var tagsData = [];

        var promises = [];

        for (i = 0; i < 20; i++)
            tagsData.push({name: chance.word()});
        promises.push(global.db.Category.bulkCreate(categoriesData));
        promises.push(global.db.Tag.bulkCreate(tagsData));
        var products = [
            {name: 'prints'}, {name: 'tazas'}, {name: 'polos'}, {name: 'carteras'}, {name: 'gorras'}, {name: 'tatuajes'}
        ];
        promises.push(global.db.ProductType.bulkCreate(products));
        global.db.Sequelize.Promise.all(promises).then(function () {
            var username, email;
            for (i = 0; i < 10; i++) {
                if (i == 0) {
                    username = 'juliocanares';
                    email = 'juliocanares@gmail.com';
                } else if (i == 1) {
                    username = 'hanshavin';
                    email = 'hansevangelista@gmail.com';
                } else if (i == 2) {
                    username = 'artjam';
                    email = 'artjam@gmail.com';
                }
                else {
                    username = chance.hashtag().replace('#', '');
                    email = chance.email();
                }
                promises.push(global.db.User.create({
                    username: username,
                    email: email,
                    firstname: chance.name(),
                    lastname: chance.last(),
                    gender: chance.gender(),
                    photo: '/img/artists/artist' + _.random(1, 4) + '.jpg',
                    isArtist: true,
                    city: chance.city(),
                    country: chance.country(),
                    school: chance.name(),
                    bigraphy: chance.paragraph({sentences: 1}),
                    isAdmin: _.sample([true, false])
                }));
            }

            global.db.Sequelize.Promise.all(promises).then(serverHandler);
        });
    } else {
        serverHandler();
    }

});

exports = module.exports = app;