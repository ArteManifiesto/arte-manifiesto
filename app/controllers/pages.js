var basePath = 'pages/';
var redirectPath = '/';

var Promise = require('bluebird');
var _ = require('lodash');
var moment = require('moment');
var request = require('request');

exports.index = function (req, res) {
    var getWorkFeaturedQuery = {
        where: {featured: true},
        attributes: [],
        include: [{
            model: global.db.Work,
            attributes: ['name', 'photo']
        }]
    };

    global.db.WorkFeatured.findAll(getWorkFeaturedQuery).then(function (workFeatureds) {
        workFeatureds = _.pluck(workFeatureds, 'Work');
        return res.render('index-org', {
            workFeatureds: workFeatureds
        })
    });
};

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
    console.log("searchable : ", searchable);
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
        //return res.json(data);
        return res.render('pages/works', data);
    });
};

exports.users = function (req, res) {
    discover(req).then(function (data) {
        //return res.json(data);
        return res.render('pages/users', data);
    });
};

exports.products = function (req, res) {
    searchBridge(req).then(function (data) {
        //return res.json(data);
        var query = {attributes: ['id', 'name', 'nameSlugify']};
        global.db.ProductType.findAll(query).then(function (productTypes) {
            data.productTypes = productTypes;
            return res.render('pages/products', data);
        });

    });
};