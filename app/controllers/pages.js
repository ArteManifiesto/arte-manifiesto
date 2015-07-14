var basePath = 'pages/';
var Promise = require('bluebird');
var _ = require('lodash');
var request = require('request');

exports.index = function (req, res) {
    var query = {where: {featured: true}, limit: 10, build: true, viewer: req.viewer};
    global.db.Product.findAll(query).then(function (products) {
        return res.render(basePath + 'index', {
            products: products
        });
    });
};

var searchHandler = function (req, res) {
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
    return global["search" + searchable](req).then(function (data) {
        data.url = global.generateUrlWithParams(data.pagination, req);
        return res.json(data);
    });
}

exports.search = function (req, res) {
    console.log(req.body.viewer);
    if (!req.body.viewer)
        return searchHandler(req, res);

    req.viewer = req.body.viewer;
    return searchHandler(req, res);
};


var searchBridge = function (req) {
    var options = {
        method: 'POST',
        body: {viewer: req.viewer},
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
        return res.render(basePath + 'works', data);
    });
};

exports.users = function (req, res) {
    discover(req).then(function (data) {
        return res.render(basePath + 'users', data);
    });
};

exports.products = function (req, res) {
    searchBridge(req).then(function (data) {
        var query = {attributes: ['id', 'name', 'nameSlugify']};
        global.db.ProductType.findAll(query).then(function (productTypes) {
            data.productTypes = productTypes;
            return res.render(basePath + 'products', data);
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

exports.completeProfile = function (req, res) {
    var specialties = req.body.specialties,
        interests = req.body.interests,
        websites = req.body.websites;


    var userData = global.getOnly([
        'username','city','country',
        'gender','birthday',    
    ])
};