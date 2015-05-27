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

var dev = !(process.env.NODE_ENV == 'production');
dev = true;
global.db.sequelize.sync({force: dev}).then(function () {
    if (dev) {
        var Chance = require('chance');
        var chance = new Chance();
        var i;

        var categoriesData = [{
            name: 'Arte Urbano'
        }, {
            name: 'Collage'
        }, {
            name: 'Dibujo'
        }, {
            name: 'Digital'
        }, {
            name: 'Escultura'
        }, {
            name: 'Fotografía'
        }, {
            name: 'Grabado'
        }, {
            name: 'Ilustración'
        }, {
            name: 'Instalación'
        }, {
            name: 'Pintura'
        }, {
            name: 'Técnica Mixta'
        }];
        var tagsData = [];

        var promises = [];

        for (i = 0; i < 20; i++)
            tagsData.push({name: chance.word()});
        promises.push(global.db.Category.bulkCreate(categoriesData));
        promises.push(global.db.Tag.bulkCreate(tagsData));
        var products = [{name: 'prints'}, {name: 'tazas'}, {name: 'polos'}, {name: 'carteras'}, {name: 'gorras'}, {name: 'tatuajes'}];
        promises.push(global.db.ProductType.bulkCreate(products));
        global.db.Sequelize.Promise.all(promises).then(function () {
            promises = [];
            var products = [];
            for (var j = 0; j < 40; j++) {
                products.push({
                    name: chance.name(),
                    price: _.random(1, 2000),
                    photo: '/img/products/product' + _.random(1, 20) + '.jpg'
                })
            }
            var users = [
                {
                    "id": 1,
                    "username": "juliocanares",
                    "email": "juliocanares@gmail.com",
                    "firstname": "Julio César",
                    "lastname": "Canares García",
                    "gender": "Masculino",
                    "photo": "//res.cloudinary.com/arte-manifiesto/image/upload/w_150,h_150,d_avatar_default.jpg/avatars/avatar_jplanas",
                    "country": "PE",
                    "city": "Lima",
                    "biography": "",
                    "facebook": "",
                    "twitter": "",
                    "flickr": "",
                    "tumblr": "",
                    "behance": "",
                    "web": "",
                    "createdAt": "2013-02-05 22:31:01"
                },
                {
                    "id": 2,
                    "username": "luis",
                    "email": "luis@artemanifiesto.com",
                    "firstname": "Luis Eduardo",
                    "lastname": "Lelele",
                    "gender": "Masculino",
                    "photo": "//res.cloudinary.com/arte-manifiesto/image/upload/w_150,h_150,d_avatar_default.jpg/avatars/avatar_jplanas",
                    "country": "PE",
                    "city": "mi dea",
                    "biography": "",
                    "facebook": "",
                    "twitter": "",
                    "flickr": "",
                    "tumblr": "",
                    "behance": "",
                    "web": "",
                    "createdAt": "2013-02-05 22:31:01"
                },
                {
                    "id": 3,
                    "username": "andreabarreda",
                    "email": "andreabarreda@hotmail.com",
                    "firstname": "andrea",
                    "lastname": "barreda",
                    "gender": "Femenino",
                    "photo": "//res.cloudinary.com/arte-manifiesto/image/upload/w_150,h_150,d_avatar_default.jpg/avatars/avatar_andreabarreda",
                    "country": "PE",
                    "city": "lima",
                    "biography": "",
                    "facebook": "https://www.facebook.com/andreabarredapintura",
                    "twitter": "",
                    "flickr": "",
                    "tumblr": "http://andreabarreda.tumblr.com/",
                    "behance": "",
                    "web": "www.andreabarreda.com",
                    "createdAt": "2013-02-05 22:56:42"
                },
                {
                    "id": 4,
                    "username": "laugustou",
                    "email": "luis.augusto.u@gmail.com",
                    "firstname": "Luis Eduardo",
                    "lastname": "Augusto",
                    "gender": "Masculino",
                    "photo": "//res.cloudinary.com/arte-manifiesto/image/upload/w_150,h_150,d_avatar_default.jpg/avatars/avatar_laugustou",
                    "country": "PE",
                    "city": "Lima",
                    "biography": "Disfrutar las cosas simples de la vida.",
                    "facebook": "http://www.facebook.com/luis.augusto.u",
                    "twitter": "http://twitter.com/laugustou",
                    "flickr": "",
                    "tumblr": "http://artemanifiesto.tumblr.com",
                    "behance": "",
                    "web": "",
                    "createdAt": "2013-02-05 22:56:42"
                },
                {
                    "id": 5,
                    "username": "ivasquez",
                    "email": "izak.ads@gmail.com",
                    "firstname": "Isaac",
                    "lastname": "Vásquez",
                    "gender": null,
                    "photo": "//res.cloudinary.com/arte-manifiesto/image/upload/w_150,h_150,d_avatar_default.jpg/avatars/avatar_ivasquez",
                    "country": null,
                    "city": null,
                    "biography": "",
                    "facebook": null,
                    "twitter": null,
                    "flickr": null,
                    "tumblr": null,
                    "behance": null,
                    "web": null,
                    "createdAt": "2013-02-05 22:56:42"
                },
                {
                    "id": 6,
                    "username": "alfierirossi",
                    "email": "ALFIERIROSSI@HOTMAIL.COM",
                    "firstname": "ALFIERI",
                    "lastname": "ROSSI",
                    "gender": "",
                    "photo": "//res.cloudinary.com/arte-manifiesto/image/upload/w_150,h_150,d_avatar_default.jpg/avatars/avatar_alfierirossi",
                    "country": "",
                    "city": "",
                    "biography": "",
                    "facebook": "",
                    "twitter": "",
                    "flickr": "",
                    "tumblr": "",
                    "behance": "",
                    "web": "",
                    "createdAt": "2013-02-05 22:56:42"
                },
                {
                    "id": 8,
                    "username": "paolarossi",
                    "email": "paorossilevano@hotmail.com",
                    "firstname": "Paola",
                    "lastname": "Rossi Lévano",
                    "gender": "",
                    "photo": "//res.cloudinary.com/arte-manifiesto/image/upload/w_150,h_150,d_avatar_default.jpg/avatars/avatar_paolarossi",
                    "country": "",
                    "city": "",
                    "biography": "",
                    "facebook": "",
                    "twitter": "",
                    "flickr": "",
                    "tumblr": "",
                    "behance": "",
                    "web": "",
                    "createdAt": "2013-02-05 22:56:42"
                },
                {
                    "id": 9,
                    "username": "andresennen",
                    "email": "ennenator@gmail.com",
                    "firstname": "Andrés",
                    "lastname": "Ennen",
                    "gender": "Masculino",
                    "photo": "//res.cloudinary.com/arte-manifiesto/image/upload/w_150,h_150,d_avatar_default.jpg/avatars/avatar_andresennen",
                    "country": "PE",
                    "city": "Lima",
                    "biography": "Artista egresado de la Facultad de Arte de la PUCP /pintura 2012\r\n\r\nDirector de \\\\\\\"Casa Pausa\\\\\\\"  espacio alternativo dedicado a la muestra y difusión de arte emergente en el Perú. Desarrollándose como Gestor y Curador de diversos eventos culturales.\r\n\r\nEmbajador y coordinador en Arte Manifiesto",
                    "facebook": "http://www.facebook.com/pages/Casa-Pausa/126941374002399",
                    "twitter": "",
                    "flickr": "",
                    "tumblr": "",
                    "behance": "",
                    "web": "",
                    "createdAt": "2013-02-05 22:56:42"
                },
                {
                    "id": 10,
                    "username": "edmalaga",
                    "email": "josemalaga@gmail.com",
                    "firstname": "Ed",
                    "lastname": "Malaga",
                    "gender": "Masculino",
                    "photo": "//res.cloudinary.com/arte-manifiesto/image/upload/w_150,h_150,d_avatar_default.jpg/avatars/avatar_edmalaga",
                    "country": "",
                    "city": "",
                    "biography": "",
                    "facebook": "www.facebook.com/edmalaga",
                    "twitter": "edmalaga",
                    "flickr": "",
                    "tumblr": "",
                    "behance": "",
                    "web": "",
                    "createdAt": "2013-02-05 22:56:42"
                }
            ];
            for (i = 0; i < users.length; i++) {
                var user = users[i];
                promises.push(global.db.User.create(user));
            }


            global.db.Sequelize.Promise.all(promises).then(function () {
                global.db.User.create({
                    username: 'artjam',
                    email: 'artjam@gmail.com',
                    firstname: 'Art',
                    lastname: 'Jam',
                    gender: 'Male',
                    photo: 'http://res.cloudinary.com/arte-manifiesto/image/upload/w_150/v1430433775/artjam_pokjgd.jpg',
                    isArtist: true,
                    city: 'Lima',
                    country: 'Perú',
                    school: 'La calle',
                    bigraphy: 'La primera competencia de batallas de arte en vivo.',
                    isAdmin: true
                }).then(function (artJam) {
                    promises = [];
                    for (var j = 0; j < products.length; j++) {
                        var product = products[j];
                        product.featured = true;
                        promises.push(global.db.Work.create(product, {user: artJam}));
                    }
                    global.db.Sequelize.Promise.all(promises).then(function (works) {
                        artJam.addWorks(works).then(function () {
                            promises = [];
                            for (var j = 0; j < products.length; j++) {
                                var product = products[j];
                                product.featured = true;
                                product.ProductTypeId = _.random(1, 5);
                                product.WorkId = works[j].id;
                                promises.push(global.db.Product.create(product, {user: artJam}));
                            }
                            global.db.Sequelize.Promise.all(promises).then(function (products) {
                                global.db.User.find({where: {username: 'juliocanares'}}).then(function (juliocanares) {
                                    global.getStoreCollection(juliocanares).then(function (jcollection) {
                                        global.getStoreCollection(artJam).then(function (collection) {
                                            var jproducts = products.slice(0, 10);
                                            products = products.slice(10, 40);
                                            juliocanares.addProducts(jproducts).then(function () {
                                                jcollection.addProducts(jproducts).then(function () {
                                                    artJam.addProducts(products).then(function () {
                                                        collection.addProducts(products);
                                                    });
                                                });
                                            });
                                        });
                                    })
                                });

                            });
                        });
                    })
                })
            });
        });
    }
    var server = app.listen(app.get('port'), function () {
        console.log('Express server listening on port', server.address().port);
    });
});

exports = module.exports = app;