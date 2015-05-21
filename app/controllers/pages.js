var basePath = 'pages/';
var redirectPath = '/';
var email = require('./email');
var Promise = require('bluebird');
var _ = require('lodash');
var moment = require('moment');
var request = require('request');
var cloudinary = require('cloudinary').v2;
var config = require('../../config/config');
var Recaptcha = require('recaptcha').Recaptcha;

exports.index = function (req, res) {
    /*return global.db.Collection.create({name: 'New Collection'}).then(function (collection) {
        global.db.Work.create({name: 'New Work'}).then(function (work) {
            collection.addWork(work).then(function () {
                global.db.Product.create({id: 10000, name: 'New Product'}).then(function (product) {
                    collection.addProduct(product).then(function () {
                        return res.json({message: 'Its working'});
                    });
                });
            });
        });
    });*/

    if(req.user){
        return req.user.getSpecialties().then(function(specialties){
            return res.json(specialties)
        });   
    }

    var recaptcha = new Recaptcha(config.recaptcha.publicKey, config.recaptcha.privateKey);

    var query = {where: {featured: true}, limit: 20};
    global.db.Product.findAll(query).then(function (workFeatureds) {
        return res.render('index', {
            workFeatureds: workFeatureds,
            recaptcha: recaptcha.toHTML()
        });
    });
};

exports.onBoard = function (req, res) {
    global.db.Category.findAll({order: [[global.db.sequelize.fn('RAND', '')]]}).then(function (categories) {
        var i, category, promises = [];
        for (i = 0; i < categories.length; i++) {
            category = categories[i];
            promises.push(category.getWorks({order: [[global.db.sequelize.fn('RAND', '')]], limit: 4}));
            promises.push(category.getSpecialties({order: [[global.db.sequelize.fn('RAND', '')]], limit: 4}));
        }
        global.db.Sequelize.Promise.all(promises).then(function (data) {
            return res.json(data);
        });
    });
}

exports.search = function (req, res) {
    var config = global.config.search;

    req.params.entity = global.getParameter(config.entities, req.params.entity);

    req.query.order = global.getParameter(config.orders[req.params.entity], req.query.order);

    if (req.query.time)
        req.query.time = global.getParameter(config.times, req.query.time);

    var item, currentParams = config.params[req.params.entity];

    for (item in req.query)
        if (currentParams.indexOf(item) == -1)
            delete req.query[item];

    var searchable = _.capitalize(req.params.entity);
    global["search" + searchable](req).then(function (data) {
        data.url = global.generateUrlWithParams(data.pagination, req);
        return res.json(data);
    });
};

var searchBridge = function (req) {
    var idUser = req.user ? req.user.id : 0;
    console.log(req.url);
    var options = {
        method: 'POST',
        body: {idUser: idUser},
        json: true,
        url: req.protocol + '://' + req.get('host') + '/search' + req.url
    };

    return new Promise(function (resolve, reject) {
        request.post(options, function (error, response, body) {
            resolve(body);
        });
    });
};

var discover = function (req) {
    return searchBridge(req).then(function (data) {
        var query = {attributes: ['name', 'nameSlugify']};

        return global.db.Category.findAll(query).then(function (categories) {
            data.categories = categories;
            return data;
        });
    });
};

exports.works = function (req, res) {
    discover(req).then(function (data) {
        return res.render('pages/works', data);
    });
};

exports.users = function (req, res) {
    discover(req).then(function (data) {
        return res.render('pages/users', data);
    });
};

exports.products = function (req, res) {
    searchBridge(req).then(function (data) {
        var query = {attributes: ['id', 'name', 'nameSlugify']};
        global.db.ProductType.findAll(query).then(function (productTypes) {
            data.productTypes = productTypes;
            return res.render('pages/products', data);
        });
    });
};

exports.storeProduct = function (req, res) {
    /*
     var getProductQuery = {
     where: {nameSlugify: req.params.nameProduct},
     attributes:[],
     include: [{
     model: global.db.Work,
     attributes: ['id'],
     include: [{
     model: global.db.User,
     include: [{model: global.db.User, as: 'Followers', attributes: [], through: {attributes: []}}]
     }]
     }]
     };
     return global.db.Product.find(getProductQuery).then(function (product) {
     return res.json(product);
     */
    /*
     var query = {
     where: {id: work.User.id},
     attributes: [],
     include: [
     {
     model: global.db.Work,
     where: {id: {not: [work.id]}}
     }
     ]
     };
     global.db.User.find(query).then(function (otherWorks) {
     if (req.user) {
     req.user.getInterests().then(function (interests) {
     var ids = [0].concat(_.pluck(interests, 'id'));

     var que = {
     where: {id: {in: ids}},
     include: [global.db.Work]
     };
     global.db.Category.findAll(que).then(function (worksforme) {
     return res.json(worksforme);
     });
     });
     } else {
     return res.json({
     work: work,
     otherWorks: otherWorks
     });
     }
     });
     */
    /*
     */
    /*
     return res.render('user/work', {
     work: work
     })
     */
    /*
     });*/


    var query = {where: {nameSlugify: req.params.nameProduct}};
    global.db.Product.find(query).then(function (product) {
        return res.render('store/product', {product: product});
    });
};

exports.productPay = function (req, res) {
    global.db.Product.find(req.params.idProduct).then(function (product) {
        var username = 'luis.augusto-facilitator_api1.funka.pe';
        var password = 'DA2FKBDA969MC9FG';
        var signature = 'AFcWxV21C7fd0v3bYYYRCpSSRl31AVe8WaAZb1aHHZTwqH86Cv8a7XhB';
        var returnUrl = 'http://localhost:3000';
        var paypal = require('paypal-express-checkout').init(username, password, signature, returnUrl, returnUrl, true);
        paypal.pay('20130001', product.price, product.name, 'USD', function (err, url) {
            if (err) {
                console.log(err);
                return;
            }
            // redirect to paypal webpage
            res.redirect(url);
        });

    });
};

exports.photos = function (req, res) {
    return res.render('photo');
};

exports.photosCreate = function (req, res) {
    var imageFile = req.files.file.path;

    cloudinary.config({
        cloud_name: 'hackdudes',
        api_key: '337494525976864',
        api_secret: 'RQ2MXJev18AjVuf-mSNzdmu2Jsc'
    });

    cloudinary.uploader.upload(imageFile)
        .then(function (image) {
            console.dir(image);
            global.getPortfolioCollection(req.user).then(function (collection) {
                global.db.Work.create({
                    name: req.body.name,
                    photo: image.url
                }).then(function (work) {
                    collection.addWork(work).then(function () {
                        var promises = [
                            collection.reorderAfterWorkAdded([work]),
                            work.setUser(req.user)
                        ];
                        global.db.Sequelize.Promise.all(promises).then(function () {
                            return res.redirect('back');
                        })
                    });
                })
            });
        })
        .then(function (photo) {
            console.log('** photo saved')
        });
};