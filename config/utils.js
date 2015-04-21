var _ = require('lodash');
var moment = require('moment');


//works/category/urban/page-1/?order=(newest,popularity,views)&time=(day,week,month,year)&featured&tag=amazing&title=art
//users/specialty/paint/page-1/?order=(newest,popularity,views)&time=(day,week,month,year)&featured&name=julio&username=juliocanares

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
            works: ['order', 'time', 'featured', 'title', 'tag'],
            users: ['order', 'time', 'featured', 'username'],
            products: ['order', 'time', 'featured', 'lo_p', 'hi_p']
        }
    }
};

global.getIdOfMyWorks = function (user) {
    var query = {attributes: ['id']};

    return user.getWorks().then(function (works) {
        return works;
    });
};

global.getPortfolioCollection = function (user) {
    var query = {
        where: {meta: 'portfolio'},
        attributes: ['id', 'meta'],
        limit: 1
    };

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

global.searchWorks = function (req) {
    var pagination = global.getPagination(req.params.page, 3);
    var queryTemplate =
        "SELECT SQL_CALC_FOUND_ROWS `Works`.`id`, `Works`.`name`, `Works`.`nameSlugify`, `Works`.`photo`, " +
        "count(DISTINCT `Works.Likes`.`id`) AS `likes`, " +
        "count(DISTINCT `Works.Collects`.`id`) AS `collects`, " +
        "count(DISTINCT `Works.Viewers`.`id`) AS `views`, " +
        "((count(DISTINCT `Works.Likes`.`id`) * 1) + (count(DISTINCT `Works.Collects`.`id`) * 3)) AS `popularity`, " +
        "case `Works`.`UserId` when <%= user %> then true else false end AS `owner`, " +
        "case `Likes`.`UserId` when <%= user %> then true else false end AS `liked`, " +
        "case `Collects`.`UserId` when <%= user %> then true else false end AS `collected`, " +
        "case `WorkViewers`.`UserId` when <%= user %> then true else false end AS `viewed`, " +
        "case `WorkFeatureds`.`featured` when true then true else false end AS `featured`, " +
        "`User`.`username` AS `User.username`, `User`.`firstname` AS `User.firstname`, `User`.`lastname` AS `User.lastname` " +
        "FROM `Categories` AS `Category` " +
        "INNER JOIN (`WorkCategories`  INNER JOIN `Works` AS `Works` ON `Works`.`id` = `WorkCategories`.`WorkId`) " +
        "ON `Category`.`id` = `WorkCategories`.`CategoryId` " +
        "AND `Works`.`public` = TRUE " +
        "<% if (time != undefined) { %> " +
        "AND `Works`.`createdAt` BETWEEN '<%= time[0] %>' AND '<%= time[1] %>' " +
        "<% } %>" +
        "<% if (title != undefined) { %> " +
        "AND `Works`.`name` LIKE '<%= title %>' " +
        "<% } %>" +
        "LEFT OUTER JOIN `Users` AS `User` ON `Works`.`UserId` = `User`.`id` " +
        "LEFT OUTER JOIN (`Likes` INNER JOIN `Users` AS `Works.Likes` ON `Works.Likes`.`id` = `Likes`.`UserId`) " +
        "ON `Works`.`id` = `Likes`.`WorkId` " +
        "LEFT OUTER JOIN (`Collects` INNER JOIN `Users` AS `Works.Collects` ON `Works.Collects`.`id` = `Collects`.`UserId`) " +
        "ON `Works`.`id` = `Collects`.`WorkId` " +
        "LEFT OUTER JOIN (`WorkViewers` INNER JOIN `Users` AS `Works.Viewers` ON `Works.Viewers`.`id` = `WorkViewers`.`UserId`) " +
        "ON `Works`.`id` = `WorkViewers`.`WorkId` " +
        "<% if (featured != undefined) { %> " +
        "INNER JOIN " +
        "<% } else { %>" +
        "LEFT OUTER JOIN " +
        "<% } %>" +
        "`WorkFeatureds` " +
        "ON `Works`.`id` = `WorkFeatureds`.`WorkId` AND `WorkFeatureds`.`featured` = TRUE " +
        "<% if (tag != undefined) { %> " +
        "INNER JOIN (`WorkTags` INNER JOIN `Tags` AS `Works.Tags` ON `Works.Tags`.`id` = `WorkTags`.`TagId`) " +
        "ON `Works`.`id` = `WorkTags`.`WorkId` " +
        "AND `Works.Tags`.`name` LIKE '<%= tag %>'  " +
        "<% } %>" +
        "<% if (category != undefined) { %> " +
        "WHERE `Category`.`id` = <%= category %> " +
        "<% } %>" +
        "GROUP BY `Works`.`id` " +
        "ORDER BY <%= order %> " +
        "LIMIT <%= offset %>,<%= limit %>;";

    var params = {
        offset: pagination.offset,
        limit: pagination.limit,
        order: global.getOrderFormated("works", req.query.order),
        category: undefined,
        tag: req.query.tag,
        title: req.query.title,
        time: undefined,
        user: req.body.idUser,
        featured: req.query.featured
    };

    if (req.query.time)
        params.time = [
            moment().startOf(req.query.time).format("YYYY-MM-DD HH:mm:ss"),
            moment().format("YYYY-MM-DD HH:mm:ss")
        ];

    if (req.query.tag)
        params.tag = req.query.tag;

    if (req.query.title)
        params.title = req.query.title;

    return global.db.Category.find({where: {nameSlugify: req.params.value}}).then(function (category) {
        if (category)
            params.category = category.id;

        var query = _.template(queryTemplate)(params);
        return global.db.sequelize.query(query, {nest: true, raw: true}).then(function (works) {

            return global.db.sequelize.query("SELECT FOUND_ROWS() AS count;", {
                nest: true,
                raw: true
            }).then(function (data) {
                var total = data[0].count;
                return {
                    currentCategory: req.params.value,
                    works: works,
                    pagination: {
                        total: total,
                        page: pagination.page,
                        limit: pagination.limit,
                        pages: Math.ceil(total / pagination.limit)
                    }
                };
            });
        });
    });
};

var mergeEntity = function (data, entity) {
    var ids = [], result = [];
    _.map(data, function (d) {
        if (ids.indexOf(d.id) == -1) {
            d[entity] = [d[entity]];
            ids.push(d.id);
            result.push(d);
        } else {
            _.findWhere(result, {id: d.id})[entity].push(d[entity]);
        }
    });
    return result;
};

global.searchUsers = function (req) {
    var pagination = global.getPagination(req.params.page, 3);
    var queryTemplate =
        "SELECT SQL_CALC_FOUND_ROWS User.`id`, User.`username`, User.`photo`, User.`firstname`, User.`lastname`, " +
        "COUNT(DISTINCT UserFollowers.`id`) AS `followers`, " +
        "COUNT(DISTINCT Viewers.`id`) AS `views`, " +
        "CASE User.`id` WHEN <%= user %> THEN TRUE ELSE FALSE END AS `owner`, " +
        "CASE UserFollowers.`id` WHEN <%= user %> THEN TRUE ELSE FALSE END AS `following`, " +
        "CASE UserViewers.`UserViewerId` WHEN <%= user %> THEN TRUE ELSE FALSE END AS `viewed`, " +
        "CASE UserFeatureds.`featured` WHEN TRUE THEN TRUE ELSE FALSE END AS `featured` " +
        "FROM `Categories` AS `Category` " +
        "INNER JOIN (`Specialties` INNER JOIN `Users` AS User ON User.`id` = Specialties.`UserId`) " +
        "ON `Category`.`id` = Specialties.`CategoryId` " +
        "<% if (username != undefined) { %> " +
        "AND User.`username` LIKE '<%= username %>' " +
        "<% } %>" +
        "<% if (firstname != undefined) { %> " +
        "AND User.`firstname` LIKE '<%= firstname %>' " +
        "<% } %>" +
        "<% if (lastname != undefined) { %> " +
        "AND User.`lastname` LIKE '<%= lastname %>' " +
        "<% } %>" +
        "<% if (time != undefined) { %> " +
        "AND User.`createdAt` BETWEEN '<%= time[0] %>' AND '<%= time[1] %>' " +
        "<% } %>" +
        "<% if (featured != undefined) { %> " +
        "INNER JOIN " +
        "<% } else { %>" +
        "LEFT OUTER JOIN " +
        "<% } %>" +
        "`UserFeatureds` ON User.`id` = UserFeatureds.`UserId` AND UserFeatureds.featured = true " +
        "LEFT OUTER JOIN (`Followers` INNER JOIN `Users` AS UserFollowers ON UserFollowers.`id` = Followers.`FollowerId`) " +
        "ON User.`id` = Followers.`FollowingId` " +
        "LEFT OUTER JOIN (`UserViewers` INNER JOIN `Users` AS Viewers ON Viewers.`id` = UserViewers.`UserViewerId`) " +
        "ON User.`id` = UserViewers.`UserViewingId` " +
        "INNER JOIN `Collections` ON User.`id` = Collections.`UserId` AND Collections.`meta` = 'portfolio' " +
        "LEFT OUTER JOIN (`CollectionWorks` AS CollectionWorks INNER JOIN `Works` ON Works.`id` = CollectionWorks.`WorkId`) " +
        "ON Collections.`id` = CollectionWorks.`CollectionId` " +
        "<% if (category != undefined) { %> " +
        "WHERE `Category`.`id` = <%= category %> " +
        "<% } %>" +
        "GROUP BY User.`id` " +
        "ORDER BY <%= order %> " +
        "LIMIT <%= offset %>,<%= limit %>;";

    var params = {
        offset: pagination.offset,
        limit: pagination.limit,
        order: global.getOrderFormated("users", req.query.order),
        category: undefined,
        username: req.query.username,
        firstname: req.query.firstname,
        lastname: req.query.lastname,
        time: undefined,
        user: req.body.idUser,
        featured: req.query.featured
    };

    if (req.query.time)
        params.time = [
            moment().startOf(req.query.time).format("YYYY-MM-DD HH:mm:ss"),
            moment().format("YYYY-MM-DD HH:mm:ss")
        ];

    return global.db.Category.find({where: {nameSlugify: req.params.value}}).then(function (category) {
        if (category)
            params.category = category.id;
        var query = _.template(queryTemplate)(params);

        return global.db.sequelize.query(query, {nest: true, raw: true}).then(function (users) {
            return global.db.sequelize.query("SELECT FOUND_ROWS() AS count;", {
                nest: true,
                raw: true
            }).then(function (data) {
                var total = data[0].count;
                return {
                    currentSpecialty: req.params.value,
                    users: users,
                    pagination: {
                        total: total,
                        page: pagination.page,
                        limit: pagination.limit,
                        pages: Math.ceil(total / pagination.limit)
                    }
                };
            });
        });
    });
    /*var query = {
     where: {nameSlugify: 'omeebofef'},
     attributes: ['name', 'nameSlugify'],
     group: [
     [{model: global.db.User, as: 'Specialties'}, 'id'],
     [{model: global.db.User, as: 'Specialties'}, global.db.Collection, global.db.Work, 'id']
     ],
     order: [[
     {model: global.db.User, as: 'Specialties'},
     global.db.Collection, global.db.Work,
     global.db.CollectionWork, 'order', 'ASC']],
     include: [
     {
     model: global.db.User,
     where: {
     username: {like: 'juliocanares'},
     firstname: {like: 'Julio César'},
     lastname: {like: 'Canares García'},
     createdAt: {
     between: [
     moment().startOf(req.query.time).toDate(),
     moment().toDate()
     ]
     }
     },
     attributes: ['id', 'username', 'firstname', 'lastname'],
     as: 'Specialties',
     through: {attributes: []},
     include: [
     {model: global.db.UserFeatured, attributes: []},
     {model: global.db.User, as: 'Followers', attributes: []},
     {model: global.db.User, as: 'UserViewers', attributes: []},
     {
     model: global.db.Collection,
     where: {meta: 'portfolio'},
     attributes: ['name'],
     include: [{
     model: global.db.Work,
     attributes: ['name', 'nameSlugify', 'photo'],
     through: {attributes: []},
     limit: 5
     }]
     }
     ]
     }
     ]
     };

     return global.db.Category.findAll(query).then(function (users) {
     var total = 20;
     return {
     currentSpecial: req.params.value,
     users: users,
     pagination: {
     total: total,
     page: pagination.page,
     limit: pagination.limit,
     pages: Math.ceil(total / pagination.limit)
     }
     };
     })*/
};

global.searchProducts = function (req) {
    var pagination = global.getPagination(req.params.page, 3);

    req.query.lo_p = req.query.lo_p || 0;
    req.query.hi_p = req.query.hi_p || 3000;

    var queryTemplate =
        "SELECT SQL_CALC_FOUND_ROWS Products.id, Products.name, Products.nameSlugify, Products.price, " +
        "COUNT(DISTINCT WorkLikes.id) AS likes, " +
        "COUNT(DISTINCT Viewers.id) AS views, " +
        "(COUNT(DISTINCT WorkLikes.id) + COUNT(DISTINCT Viewers.id)) AS popularity, " +
        "CASE Works.UserId WHEN <%= user %> THEN TRUE ELSE FALSE END AS owner, " +
        "CASE WorkLikes.id WHEN <%= user %> THEN TRUE ELSE FALSE END AS liked, " +
        "CASE Viewers.id WHEN <%= user %> THEN TRUE ELSE FALSE END AS viewed, " +
        "CASE ProductFeatureds.featured WHEN TRUE THEN TRUE ELSE FALSE END AS featured " +
        "FROM ProductTypes AS ProductType INNER JOIN Products ON ProductType.id = Products.ProductTypeId " +
        "<% if (price != undefined) { %> " +
        "AND Products.price BETWEEN '<%= price[0] %>' AND '<%= price[1] %>' " +
        "<% } %>" +
        "<% if (time != undefined) { %> " +
        "AND Products.createdAt BETWEEN '<%= time[0] %>' AND '<%= time[1] %>' " +
        "<% } %>" +
        "<% if (featured != undefined) { %> " +
        "INNER JOIN " +
        "<% } else { %>" +
        "LEFT OUTER JOIN " +
        "<% } %>" +
        "ProductFeatureds ON Products.id = ProductFeatureds.ProductId " +
        "AND ProductFeatureds.featured = TRUE LEFT OUTER JOIN Works ON Products.WorkId = Works.id " +
        "LEFT OUTER JOIN (Likes INNER JOIN Users AS WorkLikes ON WorkLikes.id = Likes.UserId) " +
        "ON Works.id = Likes.WorkId " +
        "LEFT OUTER JOIN (ProductViewers INNER JOIN Users AS Viewers ON Viewers.id = ProductViewers.UserId) " +
        "ON Products.id = ProductViewers.ProductId " +
        "<% if (productType != undefined) { %> " +
        "WHERE ProductType.id = <%= productType %> " +
        "<% } %>" +
        "GROUP BY Products.id " +
        "ORDER BY <%= order %> " +
        "LIMIT <%= offset %>,<%= limit %>;";

    var params = {
        offset: pagination.offset,
        limit: pagination.limit,
        order: global.getOrderFormated("products", req.query.order),
        price: [req.query.lo_p, req.query.hi_p],
        productType: undefined,
        time: undefined,
        user: req.body.idUser,
        featured: req.query.featured
    };

    if (req.query.time)
        params.time = [
            moment().startOf(req.query.time).format("YYYY-MM-DD HH:mm:ss"),
            moment().format("YYYY-MM-DD HH:mm:ss")
        ];

    return global.db.ProductType.find({where: {nameSlugify: req.params.value}}).then(function (productType) {
        if (productType)
            params.productType = productType.id;

        var query = _.template(queryTemplate)(params);
        return global.db.sequelize.query(query, {nest: true, raw: true}).then(function (products) {
            return global.db.sequelize.query("SELECT FOUND_ROWS() AS count;", {
                nest: true,
                raw: true
            }).then(function (data) {
                var total = data[0].count;
                return {
                    currentProductType: req.params.value,
                    products: products,
                    pagination: {
                        total: total,
                        page: pagination.page,
                        limit: pagination.limit,
                        pages: Math.ceil(total / pagination.limit)
                    }
                };
            });
        });
    });
    /*
     req.query.lo_p = req.query.lo_p || 0;
     req.query.hi_p = req.query.hi_p || 3000;

     var query = {
     where: {nameSlugify: req.params.value},
     attributes: [],
     order: [[global.db.Product, 'price', 'DESC']],
     include: [
     {
     model: global.db.Product,
     attributes: ['id', 'name', 'nameSlugify', 'price'],
     where: {
     price: {between: [req.query.lo_p, req.query.hi_p]},
     createdAt: {
     between: [
     moment().startOf(req.query.time).toDate(),
     moment().toDate()
     ]
     }
     },
     include: [
     {model: global.db.ProductFeatured, attributes: ['id'], where: {featured: true}},
     {
     model: global.db.Work,
     attributes: ['id', 'name', 'nameSlugify'],
     include: [
     {model: global.db.User, as: 'Likes', attributes: ['id']}
     ]
     },
     {model: global.db.User, as: 'ProductViewers', attributes: ['id']}
     ]
     }
     ]
     };

     return global.db.ProductType.findAll(query).then(function (products) {
     var total = 20;
     return {
     currentProductType: req.params.value,
     products: products,
     pagination: {
     total: total,
     page: pagination.page,
     limit: pagination.limit,
     pages: Math.ceil(total / pagination.limit)
     }
     };
     });*/
};

global.getPagination = function (page, limit) {
    console.log('page raw', page);
    var split = parseInt(page.split('-')[1], 10);
    page = _.isNaN(split) ? 1 : split;
    page = page > 10000 ? 1 : page;
    console.log('page ', page);
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

global.getOrderFormated = function (entity, order) {
    if (entity == "works") {
        switch (order) {
            case 'popularity':
                order = '8 DESC';
                break;
            case 'views':
                order = '7 DESC';
                break;
            case 'newest':
                order = '`Works`.`createdAt` DESC';
                break;
        }
    }
    else if (entity == "users") {
        switch (order) {
            case 'popularity':
                order = '6 DESC';
                break;
            case 'views':
                order = '7 DESC';
                break;
            case 'newest':
                order = 'User.`createdAt` DESC';
                break;
        }
    }

    else if (entity == "products") {
        switch (order) {
            case 'popularity':
                order = '7 DESC';
                break;
            case 'views':
                order = '6 DESC';
                break;
            case 'newest':
                order = 'Products.createdAt DESC';
                break;
            case 'price_asc':
                order = 'Products.price ASC';
                break;
            case 'price_desc':
                order = 'Products.price DESC';
                break;
        }
    }
    return order;
};

global.generateUrlWithParams = function (pagination, req) {
    var path =
        ['', req.params.entity, req.params.filter, req.params.value, 'page-' + pagination.page]
            .join('/');

    return req.protocol + '://' + req.get('host') + path + '/?' + global.encodeToQuery(req.query);
};