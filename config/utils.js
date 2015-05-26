var moment = require('moment');
var email = require('../app/controllers/email');
var _ = require('lodash');

global.config = {
    search: {
        entities: ['works', 'users', 'products'],
        orders: {
            works: ['popularity', 'views', 'newest'],
            users: ['popularity', 'views', 'newest'],
            products: ['popularity', 'views', 'newest', 'price_asc', 'price_desc']
        },
        times: ['day', 'week', 'month', 'year'],
        params: {
            works: ['order', 'time', 'featured', 'name', 'tag'],
            users: ['order', 'time', 'featured', 'username'],
            products: ['order', 'time', 'name', 'featured', 'lo_p', 'hi_p']
        }
    }
};

global.getStoreCollection = function (user) {
    var query = {where: {meta: 'store'}, limit: 1};
    return user.getCollections(query).then(function (collections) {
        return collections[0];
    });
};

global.slugify = function (text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
};

global.discoverGenerator = function (entity, req) {
    var options = {};
    options.entity = entity;
    options.name = req.params.entity;
    options.page = req.params.page;
    options.limit = 30;

    var query = {where: {}, build: true};
    query.viewer = req.viewer;
    query.order = [global.getOrder(req.query.order)]

    if (req.query.featured)
        query.where.featured = req.query.featured;

    if (req.query.time)
        query.where.createdAt = {
            $between: [moment().startOf(req.query.time).toDate(), moment().toDate()]
        };

    if (req.query.lo_p || req.query.hi_p)
        query.where.price = {
            $between: [req.query.lo_p || 0, req.query.hi_p || 3000]
        };

    if (req.query.name)
        query.where.name = req.query.name;

    if (req.query.username)
        query.where.username = req.query.username;

    return {options: options, query: query};
}

global.searchWorks = function (req) {
    var discover = discoverGenerator('Work', req);
    discover.query.where.public = true;
    discover.query.order.push([global.db.sequelize.col('name')]);
    return global.getPaginationEntity(discover.options, discover.query);
};

global.searchUsers = function (req) {
    var discover = discoverGenerator('User', req);
    discover.query.order.push([global.db.sequelize.col('username')]);
    return global.getPaginationEntity(discover.options, discover.query);
};

global.searchProducts = function (req) {
    var discover = discoverGenerator('Product', req);
    discover.query.where.public = true;
    discover.query.order.push([global.db.sequelize.col('name')]);
    return global.getPaginationEntity(discover.options, discover.query);
};

global.getPagination = function (page, limit) {
    var split = parseInt(page.split('-')[1], 10);
    page = _.isNaN(split) ? 1 : split;
    page = page > 10000 ? 1 : page;
    var offset = page > 0 ? ((page - 1) * limit) : 0;
    return {page: page, limit: limit, offset: offset};
};

global.getParameter = function (data, value) {
    var index = data.indexOf(value);
    if (index < 0)index = 0;
    return data[index];
};
global.encodeToQuery = function (data) {
    var ret = [];
    var param;
    for (param in data)
        ret.push(encodeURIComponent(param) + "=" + encodeURIComponent(data[param]));
    return ret.join("&");
};

global.getOrder = function (order) {
    switch (order) {
        case 'popularity':
            order = [global.db.sequelize.col('popularity'), 'DESC'];
            break;
        case 'views':
            order = [global.db.sequelize.col('views'), 'DESC'];
            break;
        case 'newest':
            order = [global.db.sequelize.col('createdAt'), 'DESC'];
            break;
        case 'price_asc':
            order = [global.db.sequelize.col('price'), 'ASC'];
            break;
        case 'price_desc':
            order = [global.db.sequelize.col('price'), 'DESC'];
            break;
    }
    return order;
};

global.generateUrlWithParams = function (pagination, req) {
    var path = [
        '', req.params.entity, req.params.filter,
        req.params.value, 'page-' + pagination.page
    ].join('/');

    return req.protocol + '://' + req.get('host') + path + '/?' + global.encodeToQuery(req.query);
};
global.emails = {
    verify: function (options) {
        var params = {
            from: 'Arte Manifiesto <contacto@artemanifiesto.com>',
            to: options.to,
            user: options.user,
            url: options.url,
            subject: 'Arte Manifiesto - Confirmación de email'
        };
        return email.send(params, 'verify').then();
    },
    forgot: function (options) {
        var params = {
            from: 'Arte Manifiesto <contacto@artemanifiesto.com>',
            to: options.to,
            user: options.user,
            url: options.url,
            subject: 'Arte Manifiesto - Cambio de contraseña'
        };
        return email.send(params, 'forgot').then();
    }
};

global.getPaginationEntity = function (options, query) {
    var pages = global.getPagination(options.page, options.limit);
    query = _.assign(query, {offset: pages.offset, limit: pages.limit});

    var promises = [];
    if (!options.association) {
        promises = [global.db[options.entity].findAll(query)]
        query = _.omit(query, 'build', 'offset', 'limit');
        promises.push(global.db[options.entity].count(query));
    }
    else {
        promises = [options.entity[options.method](query)];
        query.attributes = [
            [global.db.sequelize.fn('COUNT', global.db.sequelize.col('id')), 'total']
        ]
        query = _.omit(query, 'build', 'offset', 'limit');
        promises.push(options.entity[options.method](query));
    }

    return global.db.Sequelize.Promise.all(promises).then(function (data) {
        var total, result = {};
        result[options.name] = data[0];
        if (!options.association)
            total = data[1];
        else
            total = data[1][0].getDataValue('total');
        result.pagination = {
            total: total,
            page: pages.page,
            limit: pages.limit,
            pages: Math.ceil(total / pages.limit)
        };
        return result;
    });
};

global.objectToParameters = function (element) {
    return Object.keys(element).map(function (key) {
        return key + '=' + element[key];
    }).join('&');
}