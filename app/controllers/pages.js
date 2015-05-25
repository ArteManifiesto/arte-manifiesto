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
    var query = {where: {featured: true}, limit: 1, build: true};
    global.db.Product.findAll(query).then(function (products) {
        return res.render('index');
    });
};

exports.onBoard = function (req, res) {
    return res.render('pages/onboard');
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
    req.url = req.url.replace(req.params.page, 'page-1');
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