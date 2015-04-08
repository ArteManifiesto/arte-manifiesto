var basePath = 'pages/';
var redirectPath = '/';

var _ = require('lodash');
var moment = require('moment');
exports.index = function (req, res) {
    return res.render('index');
};

/*
 var page = parseInt(req.query.page),
 size = parseInt(req.query.size),
 skip = page > 0 ? ((page - 1) * size) : 0;
 */
exports.users = function (req, res) {
    var promises = [
        global.db.User.findAll({where: {id: {not: [req.user.id]}}, attributes: ['id', 'firstname']}),
        req.user.getFollowings({attributes: ['id']})
    ];

    global.db.Sequelize.Promise.all(promises).then(function (data) {
        var users = data[0], followings = data[1];
        return res.render(basePath + 'users', {
            users: users,
            followings: followings
        });
    });
};

exports.search = function (req, res) {
    var entity = global.getParameter(global.config.entities, req.params.entity);
    var filter = global.getParameter(global.config.filters[entity], req.params.filter);
    var filterValue = req.params.value;

    req.query.order = global.getParameter(global.config.orders, req.query.order);

    var orderIndex = ['newest', 'oldest'].indexOf(req.query.order);

    if (orderIndex > -1)
        delete req.query.time;

    if (req.query.time)
        req.query.time = global.getParameter(global.config.times, req.query.time, 3);

    req.params.page = req.params.page || 'page-1';

    var currentParams = global.config.params[entity];

    var item;
    for (item in req.query) {
        if (currentParams.indexOf(item) == -1)
            delete req.query[item];
    }

    var cleanUrl = global.generateUrlWithParams(req);

    global['search' + _.capitalize(entity)](req).then(function (data) {
        var result = {};
        result[entity] = data;
        return res.json({query: req.query, result: result});
    });

    /*
     return res.json({
     query: req.query,
     cleanUrl: cleanUrl
     });
     */
};

exports.works = function (req, res) {
    var getWorksQuery = {
        where: {public: true},
        attributes: [
            'id', 'name', 'photo', 'UserId',
            [global.db.sequelize.fn('count', global.db.sequelize.col('Likes.id')), 'likes']
        ],
        include: [
            {model: global.db.Like, attributes: ['id', 'UserId']},
            {model: global.db.Collect, attributes: ['id', 'UserId']}
        ],
        group: ['id'],
        order: [[global.db.sequelize.col('Likes.id'), 'DESC']]
    };

    global.db.Work.findAll(getWorksQuery).then(function (works) {
        var i, work;
        for (i = 0; i < works.length; i++) {
            work = works[i];
            console.log(work.name);
        }
        return res.render('pages/works', {
            works: works
        });
    });
};

exports.shop = function (req, res) {
    var getCategoriesQuery = {attributes: ['id', 'name', 'nameSlugify']};
    global.db.Category.findAll(getCategoriesQuery).then(function (categories) {
        return res.render('pages/shop', {
            categories: categories
        });
    });
};

exports.searchWork = function (req, res) {
    global.db.Category.findAll().then(function (categories) {
        categories[0].username.then(function (count) {
            return res.json(count);
        });
    });
};