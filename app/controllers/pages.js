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

var searchHandler = function (entity, req, res) {
    var config = global.config.search;
    entity = global.getParameter(config.entities, entity);

    req.query.order = global.getParameter(config.orders[entity], req.query.order);

    if (req.query.time)
        req.query.time = global.getParameter(config.times, req.query.time);

    var item, currentParams = config.params[entity];

    for (item in req.query)
        if (currentParams.indexOf(item) == -1)
            delete req.query[item];

    var searchable = _.capitalize(entity);
    return global["search" + searchable](req).then(function (data) {
        var query = global.encodeToQuery(req.query);
        data.url = req.protocol + '://' + req.get('host') + req.path + '?' + query;
        return res.json(data);
    });
};

var searchBridge = function (req) {
    var body = {viewer: req.viewer};
    var url = req.protocol + '://' + req.get('host') + req.url;
    var options = {method: 'POST', body: body, json: true, url: url};

    return new Promise(function (resolve, reject) {
      request.post(options, function (error, response, body) {
          resolve(body);
      });
    });
};

var discover = function (req, isProduct) {
    var query = {attributes: ['id', 'name', 'nameSlugify']};
    var promises = [
      searchBridge(req),
      global.db[isProduct ? 'ProductType' : 'Category'].findAll(query)
    ];
    return global.db.Sequelize.Promise.all(promises).then(function (data) {
      return {items: data[0], categories: data[1]};
    });
};

exports.works = function (req, res) {
    discover(req).then(function (data) {
        return res.render(basePath + 'works', {d: data});
    });
};

exports.users = function (req, res) {
    discover(req).then(function (data) {
        return res.render(basePath + 'users', data);
    });
};

exports.products = function (req, res) {
  discover(req, true).then(function (data) {
    return res.render(basePath + 'products', data);
  });
};

exports.search = function (entity, req, res) {
    if (!req.body.viewer)
        return searchHandler(entity, req, res);
    
    req.viewer = req.body.viewer;
    return searchHandler(entity, req, res);
};
