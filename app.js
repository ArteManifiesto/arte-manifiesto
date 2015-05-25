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
dev = false;
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
            var products = [
                {
                    "name": 'Conrad - Art Jam 2013 VOL I',
                    "price": 500,
                    "photo": 'http://res.cloudinary.com/arte-manifiesto/image/upload/w_300,q_50/v1430426644/VENTA/2013_AJ_1_CONRAD.jpg'
                },
                {
                    "name": 'Yandy - Art Jam 2013 VOL I',
                    "price": 650,
                    "photo": 'http://res.cloudinary.com/arte-manifiesto/image/upload/w_300,q_50/v1430427018/VENTA/2013_AJ_1_YANDY.jpg'
                },
                {
                    "name": 'Salima - Art Jam 2013 VOL II',
                    "price": 650,
                    "photo": 'http://res.cloudinary.com/arte-manifiesto/image/upload/w_300,q_50/v1430426983/VENTA/2013_AJ_2_SALIMA.jpg'
                },
                {
                    "name": 'Sose - Art Jam 2013 VOL II',
                    "price": 300,
                    "photo": 'http://res.cloudinary.com/arte-manifiesto/image/upload/w_300,q_50/v1430426983/VENTA/2013_AJ_2__SOSE-F.jpg'
                },
                {
                    "name": 'Malk - Art Jam 2013 VOL II',
                    "price": 300,
                    "photo": 'http://res.cloudinary.com/arte-manifiesto/image/upload/w_300,q_50/v1430427000/VENTA/2013_AJ_2_MALK.jpg'
                },
                {
                    "name": 'Ce Ardiles - Art Jam 2013 VOL III',
                    "price": 1500,
                    "photo": 'http://res.cloudinary.com/arte-manifiesto/image/upload/w_300,q_50/v1430427013/VENTA/2013_AJ_3_CE.jpg'
                },
                {
                    "name": 'Gutierrez - Art Jam 2013 VOL III',
                    "price": 500,
                    "photo": 'http://res.cloudinary.com/arte-manifiesto/image/upload/w_300,q_50/v1430427026/VENTA/2013_AJ_3_GUTIERREZ.jpg'
                },
                {
                    "name": 'Nemo - Art Jam 2013 VOL III',
                    "price": 500,
                    "photo": 'http://res.cloudinary.com/arte-manifiesto/image/upload/w_300,q_50/v1430427006/VENTA/2013_AJ_3_NEMO-F.jpg'
                },
                {
                    "name": 'ChocoCar - Art Jam 2013 VOL III',
                    "price": 500,
                    "photo": 'http://res.cloudinary.com/arte-manifiesto/image/upload/w_300,q_50/v1430426997/VENTA/2013_AJ_3_CHOCO.jpg'
                },
                {
                    "name": 'Sose - Art Jam 2013 VOL FINAL',
                    "price": 600,
                    "photo": 'http://res.cloudinary.com/arte-manifiesto/image/upload/w_300,q_50/v1430427047/VENTA/2013_FIN_SOSE.jpg'
                },
                {
                    "name": 'Mask - Art Jam 2013 VOL FINAL',
                    "price": 1000,
                    "photo": 'http://res.cloudinary.com/arte-manifiesto/image/upload/w_300,q_50/v1430427026/VENTA/2013_F_MASK.jpg'
                },
                {
                    "name": 'Peremese - Art Jam 2013 VOL FINAL',
                    "price": 500,
                    "photo": 'http://res.cloudinary.com/arte-manifiesto/image/upload/w_300,q_50/v1430427526/VENTA/2013_F_PEREMESE.jpg'
                },
                {
                    "name": 'Mask - Art Jam 2013 VOL DEMO',
                    "price": 400,
                    "photo": 'http://res.cloudinary.com/arte-manifiesto/image/upload/w_300,q_50/v1430427043/VENTA/2013_AJ_D_MASK.jpg'
                },
                {
                    "name": 'Alinder - Art Jam 2014 VOL I',
                    "price": 500,
                    "photo": 'http://res.cloudinary.com/arte-manifiesto/image/upload/w_300,q_50/v1430427044/VENTA/2014_AJ_1_ALINDER.jpg'
                },
                {
                    "name": 'Fania - Art Jam 2014 VOL I',
                    "price": 300,
                    "photo": 'http://res.cloudinary.com/arte-manifiesto/image/upload/w_300,q_50/v1430426640/VENTA/2014_AJ_1_FANIA.jpg'
                },
                {
                    "name": 'Cindy Messco - Art Jam 2014 VOL I',
                    "price": 300,
                    "photo": 'http://res.cloudinary.com/arte-manifiesto/image/upload/w_300,q_50/v1430426644/VENTA/2014_AJ_1_CINDY_MESCCO.jpg'
                },
                {
                    "name": 'Ale Wendorff - Art Jam 2014 VOL I',
                    "price": 500,
                    "photo": 'http://res.cloudinary.com/arte-manifiesto/image/upload/w_300,q_50/v1430429041/VENTA/2014_AJ_1_WENDORFFnoche_trop_-_ale_wendorff.jpg'
                },
                {
                    "name": 'Andre Coronado - Art Jam 2014 VOL I',
                    "price": 300,
                    "photo": 'http://res.cloudinary.com/arte-manifiesto/image/upload/w_300,q_50/v1430427070/VENTA/2014_AJ_1_ANDRE_COR.jpg'
                },
                {
                    "name": 'Brus Rubio - Art Jam 2014 VOL I',
                    "price": 500,
                    "photo": 'http://res.cloudinary.com/arte-manifiesto/image/upload/w_300,q_50/v1430427085/VENTA/2014_AJ_1_BRUS_RUBIO.jpg'
                },
                {
                    "name": 'Xomatok - Radio - Art Jam 2014 VOL II',
                    "price": 1900,
                    "photo": 'http://res.cloudinary.com/arte-manifiesto/image/upload/w_300,q_50/v1430427161/VENTA/2014_AJ_2_XOMATOK-VALENTINO.jpg'
                },
                {
                    "name": 'Faber - Sierrah - Art Jam 2014 VOL II',
                    "price": 1700,
                    "photo": 'http://res.cloudinary.com/arte-manifiesto/image/upload/w_300,q_50/v1430427093/VENTA/2014_AJ_2_FABER-SIERRAH.jpg'
                },
                {
                    "name": 'Musik - Trazo - Art Jam 2014 VOL II',
                    "price": 1000,
                    "photo": 'http://res.cloudinary.com/arte-manifiesto/image/upload/w_300,q_50/v1430427065/VENTA/2014_AJ_2_FABER-MUSICK.jpg'
                },
                {
                    "name": 'Ridan - Art Jam 2014 VOL III',
                    "price": 1350,
                    "photo": 'http://res.cloudinary.com/arte-manifiesto/image/upload/w_300,q_50/v1430429304/VENTA/2014_F_RIDAN.jpg'
                },
                {
                    "name": 'Ilustraaron - Art Jam 2014 VOL III',
                    "price": 600,
                    "photo": 'http://res.cloudinary.com/arte-manifiesto/image/upload/w_300,q_50/v1430427448/VENTA/2014_AJ_3_AARON.jpg'
                },
                {
                    "name": 'Macizo - Art Jam 2014 VOL III',
                    "price": 600,
                    "photo": 'http://res.cloudinary.com/arte-manifiesto/image/upload/w_300,q_50/v1430427097/VENTA/2014_AJ_3_MACIZO.jpg'
                },
                {
                    "name": 'Fiasco - Art Jam 2014 VOL III',
                    "price": 600,
                    "photo": 'http://res.cloudinary.com/arte-manifiesto/image/upload/w_300,q_50/v1430428935/VENTA/2014-AJ-3-FIASCO.jpg'
                },
                {
                    "name": 'Ridan - Art Jam 2014 VOL FINAL',
                    "price": 500,
                    "photo": 'http://res.cloudinary.com/arte-manifiesto/image/upload/w_300,q_50/v1430427084/VENTA/2014_AJ_3_RIDAN.jpg'
                },
                {
                    "name": 'Alinder - Art Jam 2014 VOL FINAL',
                    "price": 1000,
                    "photo": 'http://res.cloudinary.com/arte-manifiesto/image/upload/w_300,q_50/v1430427129/VENTA/2014_F_ALINDER.jpg'
                },
                {
                    "name": 'Cindy Messco - Art Jam 2014 VOL FINAL',
                    "price": 500,
                    "photo": 'http://res.cloudinary.com/arte-manifiesto/image/upload/w_300,q_50/v1430427150/VENTA/2014_F_CINDY_MESCCO.jpg'
                },
                {
                    "name": 'Faber - Art Jam 2014 VOL VOLT',
                    "price": 1620,
                    "photo": 'http://res.cloudinary.com/arte-manifiesto/image/upload/w_300,q_50/v1430427276/VENTA/2014_AJ_D_FABER.jpg'
                },
                {
                    "name": 'Pher - Art Jam 2014 VOL VOLT',
                    "price": 500,
                    "photo": 'http://res.cloudinary.com/arte-manifiesto/image/upload/w_300,q_50/v1430427110/VENTA/2014_AJ_D_PHER.jpg'
                },
                {
                    "name": 'Nemo - Art Jam 2014 VOL DEMO',
                    "price": 800,
                    "photo": 'http://res.cloudinary.com/arte-manifiesto/image/upload/w_300,q_50/v1430429582/VENTA/2014_AJ_D_NEMO.jpg'
                },
                {
                    "name": 'Willyto Mact - Art Jam 2013 VOL DEMO',
                    "price": 300,
                    "photo": 'http://res.cloudinary.com/arte-manifiesto/image/upload/w_300,q_50/v1430427035/VENTA/2013_AJ_D_WILLYTO.jpg'
                },
                {
                    "name": 'ART JAM DEMO',
                    "price": 700,
                    "photo": 'http://res.cloudinary.com/arte-manifiesto/image/upload/w_300,q_50/v1430427146/VENTA/2014_AJ_D_PEREMESE.jpg'
                }
            ];
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
                                global.getStoreCollection(artJam).then(function (collection) {
                                    artJam.addProducts(products).then(function () {
                                        collection.addProducts(products);
                                    });
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