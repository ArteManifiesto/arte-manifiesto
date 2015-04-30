var moment = require('moment');
var email = require('../app/controllers/email');
var Promise = require('bluebird');

//works/category/urban/page-1/?order=(newest,popularity,views)&time=(day,week,month,year)&featured&tag=amazing&title=art
//users/specialty/paint/page-1/?order=(newest,popularity,views)&time=(day,week,month,year)&featured&name=julio&username=juliocanares

global.config = {
    search: {
        entities: ['works', 'users', 'products'],
        orders: {
            works: ['popularity', 'views', 'newest'],
            users: ['popularity', 'views', 'newest'],
            products: ['popularity', 'views', 'newest', 'price_asc', 'price_desc']
        times: ['day', 'week', 'month', 'year'],
        params: {
            works: ['order', 'time', 'featured', 'name', 'tag'],
            users: ['order', 'time', 'featured', 'username'],
            products: ['order', 'time', 'name', 'featured', 'lo_p', 'hi_p']
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

global.getStoreCollection = function (user) {
    var query = {
        where: {meta: 'store'},
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

global.discoverOptions = function (req) {
    var formatTime = "YYYY-MM-DD HH:mm:ss";
    var entity = req.params.entity;
    var options = {};
    options.query = 'discover' + _.capitalize(entity);
    options.entity = entity;
    options.viewer = req.body.idUser ? req.body.idUser : 0;
    options.page = req.params.page;
    options.limit = 10;
    options.time = undefined;
    options.featured = req.query.featured;
    options.order = global.getOrder(req.query.order);
    if (req.query.time)
        options.time = [
            moment().startOf(req.query.time).format(formatTime),
            moment().format(formatTime)
        ];
    return options;
}

global.searchWorks = function (req) {
    var options = discoverOptions(req);
    options.category = undefined;
    options.tag = req.query.tag ? req.query.tag : undefined;
    options.name = req.query.name ? req.query.name : undefined;

    var query = {where: {nameSlugify: req.params.value}};
    return global.db.Category.find(query).then(function (category) {
        options.category = category ? category.id : 0;
        if (req.params.value == 'all') options.category = undefined;
        return global.getPaginationData(options);
    });
};


global.searchUsers = function (req) {
    var options = discoverOptions(req);
    options.specialty = undefined;
    options.username = req.query.username ? req.query.username : undefined;
    if (req.params.value == 'all')  req.params.value = 'arte-urbano';
    var query = {where: {nameSlugify: req.params.value}};
    return global.db.Category.find(query).then(function (specialty) {
        options.specialty = specialty ? specialty.id : 0;
        return global.getPaginationData(options).then(function (data) {
            var records = global.mergeEntity(data[options.entity], ['Works']);
            _.map(records, function (value, key) {
                value['Works'] = _.slice(value['Works'], 0, options.limit);
            });
            data[options.entity] = records;
            return data;
        });
    });
};

global.searchProducts = function (req) {
    var options = discoverOptions(req);
    req.query.lo_p = req.query.lo_p ? req.query.lo_p : 0;
    req.query.hi_p = req.query.hi_p ? req.query.hi_p : 3000;

    options.type = undefined;
    options.price = [req.query.lo_p, req.query.hi_p];
    options.name = req.query.name ? req.query.name : undefined;

    return global.db.ProductType.find({where: {nameSlugify: req.params.value}}).then(function (productType) {
        options.type = productType ? productType.id : 0;
        if (req.params.value == 'all') options.type = undefined;
        return global.getPaginationData(options);
    });
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
global.getOrder = function (order) {
    switch (order) {
        case 'popularity':
            order = '`popularity` DESC';
            break;
        case 'views':
            order = '`views` DESC';
            break;
        case 'newest':
            order = '`createdAt` DESC';
            break;
        case 'price_asc':
            order = '`price` ASC';
            break;
        case 'price_desc':
            order = '`price` DESC';
            break;
    }
    return order;
};
global.generateUrlWithParams = function (pagination, req) {
    var path =
        ['', req.params.entity, req.params.filter, req.params.value, 'page-' + pagination.page]
            .join('/');

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
global.queries = {
    /**
     * Get all works of a portfolio
     * @param options(collection)
     * @param options(offset)
     * @param options(limit)
     * @returns query
     */

    getWorksOfPortfolio: function (options, count) {
        options.count = count;
        var queryTemplate =
            "SELECT " +
            "<% if (count != undefined) { %>" +
            "COUNT(DISTINCT Work.id) AS total " +
            "<% } else { %>" +
            "Work.id, Work.name, Work.nameSlugify, Work.photo, Work.public, " +
            "CollectionWork.order " +
            "<% } %>" +
            "FROM Works AS Work INNER JOIN CollectionWorks AS CollectionWork " +
            "ON Work.id = CollectionWork.WorkId AND CollectionWork.CollectionId = <%= collection %> " +
            "<% if (count == undefined) { %> " +
            "ORDER BY CollectionWork.order ASC " +
            "LIMIT <%= offset %>,<%= limit %>" +
            "<% } %>";
        return _.template(queryTemplate)(options)
    },
    getLikes: function (options, count) {
        options.count = count;
        var queryTemplate =
            "<% if (count == undefined) { %>" +
            "SELECT `Work`.`id`, `Work`.`name`, `Work`.`nameSlugify`, `Work`.`photo`, `Work`.`featured`, " +
            "COUNT(DISTINCT `Likes`.id) AS `likes`, " +
            "CASE WHEN COUNT(DISTINCT CurrentUser.id) > 0 THEN TRUE ELSE FALSE END AS `liked` " +
            "<% } else { %>" +
            "SELECT COUNT(DISTINCT Work.id) AS total " +
            "<% } %>" +
            "FROM (SELECT `Work`.* FROM `Works` AS `Work` INNER JOIN `Likes` AS `Likes` " +
            "ON `Work`.`id` = `Likes`.`WorkId` AND `Likes`.`UserId` = <%= user %> WHERE (`Work`.`public` = TRUE)" +
            "<% if (count == undefined) { %> LIMIT <%= offset %>,<%= limit %> <% } %>) AS `Work` " +
            "<% if (count == undefined) { %>" +
            "LEFT OUTER JOIN (`Likes` AS `Likes.Likes` INNER JOIN `Users` AS `Likes` " +
            "ON `Likes`.`id` = `Likes.Likes`.`UserId`) ON `Work`.`id` = `Likes.Likes`.`WorkId` " +
            "LEFT OUTER JOIN (`Likes` AS `CurrentUser.Likes` INNER JOIN `Users` AS CurrentUser " +
            "ON CurrentUser.`id` = `CurrentUser.Likes`.`UserId`)ON `Work`.`id` = `CurrentUser.Likes`.`WorkId` " +
            "AND CurrentUser.`id` = <%= viewer %>  " +
            "GROUP BY WORK.id;" +
            "<% } %>";
        return _.template(queryTemplate)(options)
    },
    getProductsOfStore: function (options, count) {
        options.count = count;
        var queryTemplate =
            "SELECT " +
            "<% if (count != undefined) { %>" +
            "COUNT(DISTINCT Work.id) AS total " +
            "<% } else { %>" +
            "Work.id, Work.name, Work.nameSlugify, Work.photo, Work.public, " +
            "CollectionWork.order " +
            "<% } %>" +
            "FROM Works AS Work INNER JOIN CollectionWorks AS CollectionWork " +
            "ON Work.id = CollectionWork.WorkId AND CollectionWork.CollectionId = <%= collection %> " +
            "<% if (count == undefined) { %> " +
            "ORDER BY CollectionWork.order ASC " +
            "LIMIT <%= offset %>,<%= limit %>" +
            "<% } %>";
        return _.template(queryTemplate)(options)
    },
    getCollectionsProduct: function (options, count) {
        options.count = count;
        var queryTemplate =
            "SELECT " +
            "<% if (count != undefined) { %>" +
            "COUNT(DISTINCT Collection.id) AS total " +
            "<% } else { %>" +
            "id, name " +
            "<% } %>" +
            "FROM Collections AS Collection " +
            "WHERE (Collection.UserId = <%= user %> AND Collection.meta = 'product') " +
            "<% if (count == undefined) { %> " +
            "ORDER BY Collection.createdAt ASC " +
            "LIMIT <%= offset %>,<%= limit %>" +
            "<% } %>";
        return _.template(queryTemplate)(options)
    }

};
global.getNumFollowersOfUser = function (options) {
    var queryTemplate =
        "SELECT COUNT(DISTINCT `User`.`id`) AS `followers` " +
        "FROM `Users` AS `User` INNER JOIN `Followers` AS `Followers` " +
        "ON `User`.`id` = `Followers`.`FollowerId` " +
        "AND `Followers`.`FollowingId` = <%= user %>;";
    return getCount(queryTemplate, options);
};
global.getNumFollowingsOfUser = function (options) {
    var queryTemplate =
        "SELECT COUNT(DISTINCT `User`.`id`) AS `followings` " +
        "FROM `Users` AS `User` INNER JOIN `Followers` AS `Followers` " +
        "ON `User`.`id` = `Followers`.`FollowingId` " +
        "AND `Followers`.`FollowerId` = <%=user%>;";
    return getCount(queryTemplate, options);
};
global.getNumLikesOfUser = function (options) {
    var queryTemplate =
        "SELECT COUNT(DISTINCT `Work`.`id`) AS `likes` " +
        "FROM `Works` AS `Work` INNER JOIN `WorkLikes` " +
        "ON `Work`.`id` = `WorkLikes`.`WorkId` " +
        "AND `WorkLikes`.`UserId` = <%= user %>;";
    return getCount(queryTemplate, options);
};
global.getNumCollectionsOfUser = function (options) {
    var queryTemplate =
        "SELECT COUNT(DISTINCT Collection.id) AS `<%= meta %>` " +
        "FROM `Collections` AS `Collection` " +
        "WHERE (`Collection`.`UserId` = <%= user %> " +
        "AND `Collection`.`meta` = '<%= meta %>');";
    return getCount(queryTemplate, options);
};

global.getNumLikesOfWork = function (options) {
    var queryTemplate =
        "SELECT COUNT(DISTINCT `User`.`id`) AS `likes` " +
        "FROM `Users` AS `User` INNER JOIN `WorkLikes` AS `Likes` " +
        "ON `User`.`id` = `Likes`.`UserId` " +
        "AND `Likes`.`WorkId` = <%= work %>;";
    return getCount(queryTemplate, options);
};
global.getNumLikesOfProduct = function (options) {
    var queryTemplate =
        "SELECT COUNT(DISTINCT `User`.`id`) AS `likes` " +
        "FROM   `Users` AS `User` INNER JOIN `ProductLikes` AS `Likes` " +
        "ON `User`.`id` = `Likes`.`UserId` " +
        "AND `Likes`.`ProductId` = <%= product %>;";
    return getCount(queryTemplate, options);
}
global.getCount = function (queryTemplate, options) {
    var query = _.template(queryTemplate)(options);
    return global.db.sequelize.query(query, {nest: true, raw: true}).then(function (data) {
        return data[0];
    });
};
global.getWorksOfCollection = function (options, count) {
    options.count = count;
    var queryTemplate =
        "<% if (count == undefined) { %>" +
        "SELECT `Work`.`id`, `Work`.`name`, `Work`.`nameSlugify`, `Work`.`photo`, " +
        "`Work`.`public`, `Work`.`featured`, " +
        "COUNT(DISTINCT `Likes`.id) AS `likes`, " +
        "CASE WHEN COUNT(DISTINCT CurrentUser.id) > 0 THEN TRUE ELSE FALSE END AS `liked` " +
        "<% } else { %>" +
        "SELECT COUNT(DISTINCT Work.id) AS total " +
        "<% } %>" +
        "FROM (SELECT `Work`.*, `CollectionWork`.`order` AS `CollectionWork.order` " +
        "FROM `Works` AS `Work` INNER JOIN `CollectionWorks` AS `CollectionWork` " +
        "ON `Work`.`id` = `CollectionWork`.`WorkId` AND `CollectionWork`.`CollectionId` = <%= collection %> " +
        "<% if (count == undefined) { %> LIMIT <%= offset %>,<%= limit %> <% } %>) AS `Work` " +
        "<% if (count == undefined) { %>" +
        "LEFT OUTER JOIN (`WorkLikes` AS `Work.Likes` INNER JOIN `Users` AS `Likes` " +
        "ON `Likes`.`id` = `Work    .Likes`.`UserId`) ON `Work`.`id` = `Work.Likes`.`WorkId` " +
        "LEFT OUTER JOIN (`WorkLikes` AS `CurrentUser.Likes` INNER JOIN `Users` AS CurrentUser " +
        "ON CurrentUser.`id` = `CurrentUser.Likes`.`UserId`) ON `Work`.`id` = `CurrentUser.Likes`.`WorkId` " +
        "AND CurrentUser.`id` = <%=viewer%> " +
        "GROUP BY Work.id ORDER BY `CollectionWork.order` ASC;" +
        "<% } %>";
    return _.template(queryTemplate)(options)
};
global.getWorksLikesOfUser = function (options, count) {
    options.count = count;
    var queryTemplate =
        "<% if (count == undefined) { %>" +
        "SELECT `<%=meta%>`.`id`, `<%=meta%>`.`name`, `<%=meta%>`.`nameSlugify`, `<%=meta%>`.`photo`, `<%=meta%>`.`featured`, " +
        "COUNT(DISTINCT `Likes`.id) AS `likes`, " +
        "IF(COUNT(DISTINCT CurrentUser.id) > 0 , TRUE , FALSE) AS `liked` " +
        "<% } else { %>" +
        "SELECT COUNT(DISTINCT <%=meta%>.id) AS total " +
        "<% } %>" +
        "FROM (SELECT `<%=meta%>`.* FROM `<%=meta%>s` AS `<%=meta%>` INNER JOIN `<%=meta%>Likes` AS `<%=meta%>.Likes` " +
        "ON `<%=meta%>`.`id` = `<%=meta%>.Likes`.`<%=meta%>Id` AND `<%=meta%>.Likes`.`UserId` = <%= user %> " +
        "WHERE (`<%=meta%>`.`public` = TRUE)" +
        "<% if (count == undefined) { %> LIMIT <%= offset %>,<%= limit %> <% } %>) AS `<%=meta%>` " +
        "<% if (count == undefined) { %>" +
        "LEFT OUTER JOIN (`<%=meta%>Likes` AS `Likes.Likes` INNER JOIN `Users` AS `Likes` " +
        "ON `Likes`.`id` = `Likes.Likes`.`UserId`) ON `<%=meta%>`.`id` = `Likes.Likes`.`<%=meta%>Id` " +
        "LEFT OUTER JOIN (`<%=meta%>Likes` AS `CurrentUser.Likes` INNER JOIN `Users` AS CurrentUser " +
        "ON CurrentUser.`id` = `CurrentUser.Likes`.`UserId`)ON `<%=meta%>`.`id` = `CurrentUser.Likes`.`<%=meta%>Id` " +
        "AND CurrentUser.`id` = <%= viewer %>  " +
        "GROUP BY <%=meta%>.id;" +
        "<% } %>";
    return _.template(queryTemplate)(options)
};



global.getCollectionsByMeta = function (options, count) {
    options.count = count;
    var queryTemplate =
        "<% if (count == undefined) { %>" +
        "SELECT `id`, `name` " +
        "<% } else { %>" +
        "SELECT COUNT(DISTINCT Collection.id) AS total " +
        "<% } %>" +
        "FROM `Collections` AS `Collection` " +
        "WHERE (`Collection`.`UserId` = <%= user %> " +
        "AND `Collection`.`meta` = '<%= meta %>') " +
        "<% if (count == undefined) { %>" +
        "LIMIT <%= offset %>,<%= limit %>" +
        "<% } %>";
    return _.template(queryTemplate)(options)
};
global.relations = function (options, count) {
    options.count = count;
    var queryTemplate =
        "<% if (count == undefined) { %>" +
        "SELECT `User`.id, `User`.username, `User`.firstname, `User`.lastname, " +
        "`User`.photo, `User`.country, `User`.city, `User`.featured, " +
        "CASE WHEN COUNT(DISTINCT CurrentUser.id) > 0 THEN TRUE ELSE FALSE END AS `following`, " +
        "COUNT(DISTINCT `Followers`.id) AS `followers`, " +
        "`Works`.`id` AS `Works.id`, `Works`.`name` AS `Works.name`, " +
        "`Works`.`nameSlugify` AS `Works.nameSlugify`, `Works`.`photo` AS `Works.photo` " +
        "<% } else { %>" +
        "SELECT COUNT(DISTINCT User.id) AS total " +
        "<% } %>" +
        "FROM (SELECT `User`.* FROM `Users` AS `User` INNER JOIN `Followers` AS `Followers` " +
        "<% if (relation == 'followers') { %>" +
        "ON `User`.`id` = `Followers`.`FollowerId` AND `Followers`.`FollowingId` = <%=user%> " +
        "<% } else { %>" +
        "ON `User`.`id` = `Followers`.`FollowingId` AND `Followers`.`FollowerId` = <%=user%> " +
        "<% } %>" +
        "<% if (count == undefined) { %> LIMIT <%=offset%>,<%=limit%> <% } %>) AS `User` " +
        "<% if (count == undefined) { %>" +
        "LEFT OUTER JOIN (`Followers` AS `CurrentUser.Followers` INNER JOIN `Users` AS CurrentUser " +
        "ON CurrentUser.`id` = `CurrentUser.Followers`.`FollowerId`)" +
        "ON `User`.`id` = `CurrentUser.Followers`.`FollowingId` AND CurrentUser.`id` = <%=viewer%> " +
        "LEFT OUTER JOIN (`Followers` AS `Followers.Followers` INNER JOIN `Users` AS `Followers` " +
        "ON `Followers`.`id` = `Followers.Followers`.`FollowerId`) " +
        "ON `User`.`id` = `Followers.Followers`.`FollowingId` " +
        "LEFT OUTER JOIN `Works` AS `Works` ON `User`.`id` = `Works`.`UserId` " +
        "AND `Works`.`public` = TRUE " +
        "GROUP BY User.id, Works.id;" +
        "<% } %>";
    return _.template(queryTemplate)(options)
};

global.discoverUsers = function (options, count) {
    options.count = count;
    var queryTemplate =
        "SELECT * FROM (" +
        "<% if (count == undefined) { %>" +
        "SELECT `User`.`id`, `User`.`username`, `User`.`photo`, `User`.`firstname`, `User`.`lastname`, " +
        "`User`.`featured`, `User`.`createdAt`, " +
        "COUNT(DISTINCT `User.Followers`.`id`) AS `followers`, " +
        "COUNT(DISTINCT `User.Views`.`id`) AS `views`, " +
        "((COUNT(DISTINCT `User.Followers`.`id`) * 1) + (COUNT(DISTINCT `User.Views`.`id`) * 3)) AS `popularity`, " +
        "IF(`User`.`id` = 0, TRUE, FALSE) AS `owner`, " +
        "IF(COUNT(DISTINCT `CurrentUser.Followers`.`id`) > 0 , TRUE, FALSE) AS `following`, " +
        "IF(COUNT(DISTINCT `CurrentUser.Views`.`id`) > 0, TRUE, FALSE) AS `viewed`, " +
        "`Works`.`id` AS `Works.id`, `Works`.`name` AS `Works.name`, `Works`.`nameSlugify` AS `Works.nameSlugify`, " +
        "`Works`.`photo` AS `Works.photo` " +
        "<% } else { %>" +
        "SELECT COUNT(DISTINCT `User`.`id`) AS `total` " +
        "<% } %>" +
        "FROM (SELECT `User`.* FROM `Users` AS `User` INNER JOIN `Specialties` AS `Specialties` " +
        "ON `User`.`id` = `Specialties`.`UserId` " +
        "<% if (specialty != undefined) { %> AND `Specialties`.`CategoryId` = <%=specialty%> <% } %> " +
        "<% if (username != undefined) { %> AND `User`.`username` = '<%=username%>' <% } %> " +
        "<% if (featured != undefined) { %> AND `User`.`featured` = TRUE <% } %> " +
        "<% if (time != undefined) { %> AND `User`.`createdAt` BETWEEN '<%=time[0]%>' AND '<%=time[1]%>' <% } %> " +
        "<% if (count == undefined) { %> LIMIT <%=offset%>,<%=limit%> <% } %> ) AS `User` " +
        "LEFT OUTER JOIN (`Followers` INNER JOIN `Users` AS `User.Followers` ON `User.Followers`.`id` = `Followers`.`FollowerId`) " +
        "ON `User`.`id` = `Followers`.`FollowingId` " +
        "LEFT OUTER JOIN (`Followers` AS `CurrentUserFollowers` INNER JOIN `Users` AS `CurrentUser.Followers` " +
        "ON `CurrentUser.Followers`.`id` = `CurrentUserFollowers`.`FollowerId`) " +
        "ON `User`.`id` = `CurrentUserFollowers`.`FollowingId` AND `CurrentUser.Followers`.`id` = <%=viewer%> " +
        "LEFT OUTER JOIN (`UserViews` INNER JOIN `Users` AS `User.Views` ON `User.Views`.`id` = `UserViews`.`ViewerId`) " +
        "ON `User`.`id` = UserViews.`ViewingId` LEFT OUTER JOIN (`UserViews` AS `CurrentUserViews` " +
        "INNER JOIN `Users` AS `CurrentUser.Views` ON `CurrentUser.Views`.`id` = `CurrentUserViews`.`ViewerId`) " +
        "ON `User`.id = `CurrentUserViews`.`ViewingId` AND `CurrentUser.Views`.id = <%=viewer%> " +
        "INNER JOIN `Collections` ON `User`.`id` = Collections.`UserId` AND Collections.`meta` = 'portfolio' " +
        "LEFT OUTER JOIN (`CollectionWorks` AS CollectionWorks INNER JOIN `Works` ON Works.`id` = CollectionWorks.`WorkId`) " +
        "ON Collections.`id` = CollectionWorks.`CollectionId` " +
        "<% if (count == undefined) { %> GROUP BY `User`.`id`, `Works`.id <% } %> ) AS `users`" +
        "<% if (count == undefined) { %> ORDER BY <%=order%>,`username` <%  } %>";
    return _.template(queryTemplate)(options);

}

global.discoverProducts = function (options, count) {
    options.count = count;
    var queryTemplate =
        "SELECT * FROM (" +
        "<% if (count == undefined) { %>" +
        "SELECT `Products`.`id`, `Products`.`name`, `Products`.`nameSlugify`, `Products`.`photo`, `Products`.`price`, " +
        "`Products`.`featured`, `Products`.`createdAt`, " +
        "COUNT(DISTINCT `Products.Likes`.`id`) AS `likes`, " +
        "COUNT(DISTINCT `Products.Collects`.`id`) AS `collects`, " +
        "COUNT(DISTINCT `Products.Views`.`id`) AS `views`, " +
        "((COUNT(DISTINCT `Products.Likes`.`id`) * 1) + (COUNT(DISTINCT `Products.Collects`.`id`) * 3)) AS `popularity`, " +
        "IF(`Products`.`UserId` = <%=viewer%>, TRUE, FALSE) AS `owner`, " +
        "IF(COUNT(DISTINCT `CurrentUser.Likes`.`id`) > 0, TRUE, FALSE) AS `liked`, " +
        "IF(COUNT(DISTINCT `CurrentUser.Collects`.`id`) > 0, TRUE, FALSE) AS `collected`, " +
        "IF(COUNT(DISTINCT `CurrentUser.Views`.`id`) > 0, TRUE, FALSE) AS `viewed`, " +
        "`User`.`username` AS `User.username`, " +
        "`Work`.`name` AS `Work.name`, `Work`.`nameSlugify` AS `Work.nameSlugify`, `Work`.`photo` AS `Work.photo` " +
        "<% } else { %>" +
        "SELECT COUNT(DISTINCT `Products`.`id`) AS `total` " +
        "<% } %>" +
        "FROM `ProductTypes` AS `ProductType` INNER JOIN `Products` ON `ProductType`.`id` = `Products`.`ProductTypeId` " +
        "AND `Products`.`public` = TRUE " +
        "<% if (price != undefined) { %> AND `Products`.`price` BETWEEN '<%=price[0]%>' AND '<%=price[1]%>' <% } %> " +
        "<% if (time != undefined) { %> AND `Products`.`createdAt` BETWEEN '<%=time[0]%>' AND '<%=time[1]%>' <% } %> " +
        "<% if (name != undefined) { %> AND `Products`.`name` LIKE '<%=name%>' <% } %> " +
        "<% if (featured != undefined) { %> AND `Products`.`featured` = TRUE <% } %> " +
        "LEFT OUTER JOIN `Works` AS `Work` ON `Products`.`WorkId` = `Work`.`id` " +
        "LEFT OUTER JOIN `Users` AS `User` ON `Products`.`UserId` = `User`.`id` " +
        "LEFT OUTER JOIN (`ProductLikes` INNER JOIN `Users` AS `Products.Likes` " +
        "ON `Products.Likes`.`id` = `ProductLikes`.`UserId`) ON `Products`.id = `ProductLikes`.`ProductId` " +
        "LEFT OUTER JOIN (`ProductLikes` AS `CurrentUserLikes` " +
        "INNER JOIN `Users` AS `CurrentUser.Likes` ON `CurrentUser.Likes`.`id` = `CurrentUserLikes`.`UserId`) " +
        "ON `Products`.id = `CurrentUserLikes`.`ProductId` AND `CurrentUser.Likes`.id = <%=viewer%> " +
        "LEFT OUTER JOIN (`ProductCollects` INNER JOIN `Users` AS `Products.Collects` " +
        "ON `Products.Collects`.`id` = `ProductCollects`.`UserId`) ON `Products`.id = `ProductCollects`.`ProductId` " +
        "LEFT OUTER JOIN (`ProductCollects` AS `CurrentUserCollects` " +
        "INNER JOIN `Users` AS `CurrentUser.Collects` ON `CurrentUser.Collects`.`id` = `CurrentUserCollects`.`UserId`) " +
        "ON `Products`.id = `CurrentUserCollects`.`ProductId` AND `CurrentUser.Collects`.id = <%=viewer%> " +
        "LEFT OUTER JOIN (`ProductViews` INNER JOIN `Users` AS `Products.Views` " +
        "ON `Products.Views`.`id` = `ProductViews`.`UserId`) ON `Products`.id = `ProductViews`.`ProductId` " +
        "LEFT OUTER JOIN (`ProductViews` AS `CurrentUserViews` " +
        "INNER JOIN `Users` AS `CurrentUser.Views` ON `CurrentUser.Views`.`id` = `CurrentUserViews`.`UserId`) " +
        "ON `Products`.id = `CurrentUserViews`.`ProductId` AND `CurrentUser.Views`.id = <%=viewer%> " +
        "<% if (type != undefined) { %> WHERE `ProductType`.`id` = <%=type%> <% } %> " +
        "<% if (count == undefined) { %> GROUP BY `Products`.`id` <% } %> ) AS `products` " +
        "<% if (count == undefined) { %> ORDER BY <%=order%>,`name` <%  } %>" +
        "<% if (count == undefined) { %> LIMIT <%=offset%>,<%=limit%> <% } %>";
    return _.template(queryTemplate)(options);
};
global.discoverWorks = function (options, count) {
    options.count = count;
    var queryTemplate =
        "SELECT * FROM (" +
        "<% if (count == undefined) { %>" +
        "SELECT `Works`.`id`, `Works`.`name`, `Works`.`nameSlugify`, `Works`.`photo`, `Works`.`featured`, `Works`.`createdAt`, " +
        "COUNT(DISTINCT `Works.Likes`.`id`) AS `likes`, " +
        "COUNT(DISTINCT `Works.Collects`.`id`) AS `collects`, " +
        "COUNT(DISTINCT `Works.Views`.`id`) AS `views`, " +
        "((COUNT(DISTINCT `Works.Likes`.`id`) * 1) + (COUNT(DISTINCT `Works.Collects`.`id`) * 3)) AS `popularity`, " +
        "IF(`Works`.`UserId` = <%= viewer %>, TRUE, FALSE) AS `owner`, " +
        "IF(COUNT(DISTINCT `CurrentUser.Likes`.`id`) > 0, TRUE, FALSE) AS `liked`, " +
        "IF(COUNT(DISTINCT `CurrentUser.Collects`.`id`) > 0, TRUE, FALSE) AS `collected`, " +
        "IF(COUNT(DISTINCT `CurrentUser.Views`.`id`) > 0, TRUE, FALSE) AS `viewed`, " +
        "`User`.`username` AS `User.username`, `User`.`firstname` AS `User.firstname`, " +
        "`User`.`lastname` AS `User.lastname`, `User`.`country` AS `User.country`, " +
        "`User`.`city` AS `User.city`, `User`.`featured` AS `User.featured` " +
        "<% } else { %>" +
        "SELECT COUNT(DISTINCT `Works`.id) AS `total` " +
        "<% } %>" +
        "FROM `Categories` AS `Category` INNER JOIN (`WorkCategories` " +
        "INNER JOIN `Works` AS `Works` ON `Works`.`id` = `WorkCategories`.`WorkId`) " +
        "ON `Category`.`id` = `WorkCategories`.`CategoryId` AND `Works`.`public` = TRUE " +
        "<% if (time != undefined) { %> AND `Works`.`createdAt` BETWEEN '<%=time[0]%>' AND '<%= time[1]%>' <% } %> " +
        "<% if (name != undefined) { %> AND `Works`.`name` LIKE '<%=name%>' <% } %> " +
        "<% if (featured != undefined) { %> AND `Works`.`featured` = TRUE  <% } %> " +
        "LEFT OUTER JOIN `Users` AS `User` ON `Works`.`UserId` = `User`.`id` " +
        "LEFT OUTER JOIN (`WorkLikes` INNER JOIN `Users` AS `Works.Likes` ON `Works.Likes`.`id` = `WorkLikes`.`UserId`) " +
        "ON `Works`.`id` = `WorkLikes`.`WorkId`" +
        "LEFT OUTER JOIN (`WorkLikes` AS `CurrentUserLikes` INNER JOIN `Users` AS `CurrentUser.Likes` " +
        "ON `CurrentUser.Likes`.`id` = `CurrentUserLikes`.`UserId`)" +
        "ON `Works`.`id` = `CurrentUserLikes`.`WorkId` AND `CurrentUser.Likes`.`id` = <%=viewer%> " +
        "LEFT OUTER JOIN (`WorkCollects` INNER JOIN `Users` AS `Works.Collects` ON `Works.Collects`.`id` = `WorkCollects`.`UserId`) " +
        "ON `Works`.`id` = `WorkCollects`.`WorkId` " +
        "LEFT OUTER JOIN (`WorkCollects` AS `CurrentUserCollects`" +
        "INNER JOIN `Users` AS `CurrentUser.Collects` ON `CurrentUser.Collects`.`id` = `CurrentUserCollects`.`UserId`)" +
        "ON `Works`.`id` = `CurrentUserCollects`.`WorkId` AND `CurrentUser.Collects`.`id` = <%=viewer%> " +
        "LEFT OUTER JOIN (`WorkViews` INNER JOIN `Users` AS `Works.Views` ON `Works.Views`.`id` = `WorkViews`.`UserId`) " +
        "ON `Works`.`id` = `WorkViews`.`WorkId` " +
        "LEFT OUTER JOIN (`WorkViews` AS `CurrentUserViews`" +
        "INNER JOIN `Users` AS `CurrentUser.Views` ON `CurrentUser.Views`.`id` = `CurrentUserViews`.`UserId`)" +
        "ON `Works`.`id` = `CurrentUserViews`.`WorkId` AND `CurrentUser.Views`.`id` = <%=viewer%> " +
        "<% if (tag != undefined) { %> " +
        "INNER JOIN (`WorkTags` INNER JOIN `Tags` AS `Works.Tags` ON `Works.Tags`.`id` = `WorkTags`.`TagId`) " +
        "ON `Works`.`id` = `WorkTags`.`WorkId` AND `Works.Tags`.`name` LIKE '<%=tag%>' " +
        "<% } %> " +
        "<% if (category != undefined) { %> WHERE `Category`.`id` = <%=category%> <% } %> " +
        "<% if (count == undefined) { %> GROUP BY `Works`.`id` <% } %> ) AS `works` " +
        "<% if (count == undefined) { %> ORDER BY <%=order%>,`name` <%  } %>" +
        "<% if (count == undefined) { %> LIMIT <%=offset%>,<%=limit%> <% } %>"
    return _.template(queryTemplate)(options);
};
global.getProduct = function (options) {
    var queryTemplate =
        "SELECT `Product`.`id`, `Product`.`name`, `Product`.`nameSlugify`, `Product`.`price`, `Product`.`photo`," +
        "`Product`.`description`, `Product`.`featured`, `ProductTypes`.`name` AS `type`, " +
        "COUNT(DISTINCT `Product.Likes`.`id`) AS `likes`, " +
        "COUNT(DISTINCT `Product.Collects`.`id`) AS `collects`, " +
        "COUNT(DISTINCT `Product.Views`.`id`) AS `views`, " +
        "IF(`Product`.`UserId` = <%=viewer%>, TRUE, FALSE) AS `owner`, " +
        "IF(`ProductLikes`.`UserId` = <%=viewer%>, TRUE, FALSE) AS `liked`, " +
        "IF(`ProductCollects`.UserId = <%=viewer%>, TRUE, FALSE) AS `collected`, " +
        "IF(`ProductViews`.UserId = <%=viewer%>, TRUE, FALSE) AS `viewed`, " +
        "`User`.`id` AS `User.id`, `User`.`username` AS `User.username`, `User`.`firstname` AS `User.firstname`, " +
        "`User`.`lastname` AS `User.lastname`,`User`.`photo` AS `User.photo` " +
        "FROM (SELECT `Product`.* FROM `Products` AS `Product` WHERE `Product`.`nameSlugify` = '<%=name%>' LIMIT 1) " +
        "AS `Product` LEFT OUTER JOIN `Users` AS `User` ON `Product`.`UserId` = `User`.`id` " +
        "LEFT OUTER JOIN (`ProductLikes` AS `ProductLikes` INNER JOIN `Users` AS `Product.Likes` " +
        "ON `Product.Likes`.`id` = `ProductLikes`.`UserId`) ON `Product`.`id` = `ProductLikes`.`ProductId` " +
        "LEFT OUTER JOIN  (`ProductCollects` AS `ProductCollects` INNER JOIN `Users` AS `Product.Collects` " +
        "ON `Product.Collects`.`id` = `ProductCollects`.`UserId`) ON `Product`.`id` = `ProductCollects`.`ProductId` " +
        "LEFT OUTER JOIN (`ProductViews` AS `ProductViews` INNER JOIN `Users` AS `Product.Views` " +
        "ON `Product.Views`.`id` = `ProductViews`.`UserId`) ON `Product`.`id` = `ProductViews`.`ProductId` " +
        "LEFT OUTER JOIN `ProductTypes` ON `Product`.`ProductTypeId` = `ProductTypes`.`id`;";
    return _.template(queryTemplate)(options);
};

global.getUserLikesProduct = function (options) {
    var queryTemplate =
        "SELECT `User`.`id`, `User`.`username`, `User`.`firstname`, `User`.`lastname`, `User`.`photo` " +
        "FROM `Users` AS `User` INNER JOIN `ProductLikes` ON `User`.`id` = `ProductLikes`.`UserId` " +
        "AND `ProductLikes`.`ProductId` = <%=product%> LIMIT <%=limit%>;";
    return _.template(queryTemplate)(options);
}

global.mergeEntity = function (data, entity) {
    var ids = [], result = [];
    _.map(data, function (d) {
        if (ids.indexOf(d.id) == -1) {
            _.map(d, function (value, key) {
                if (entity.indexOf(key) > -1) {
                    console.log(d[key].id);
                    if (d[key].id != null)
                        d[key] = [d[key]];
                    else
                        d[key] = [];
                }
            });
            ids.push(d.id);
            result.push(d);
        } else {
            var currentData = _.findWhere(result, {id: d.id});
            _.map(currentData, function (value, key) {
                if (entity.indexOf(key) > -1) {
                    if (_.findWhere(currentData[key], {id: d[key].id}) == undefined)
                        currentData[key].push(d[key]);
                }
            });
        }
    });
    return result;
};


global.getPaginationData = function (options) {
    var pages = global.getPagination(options.page, options.limit);

    options.offset = pages.offset;
    options.limit = pages.limit;

    var recordsQuery = global[options.query](options);
    var countQuery = global[options.query](options, true);

    var promises = [
        global.db.sequelize.query(recordsQuery, {nest: true, raw: true}),
        global.db.sequelize.query(countQuery, {nest: true, raw: true})
    ];

    return global.db.Sequelize.Promise.all(promises).then(function (data) {
        var records = data[0], total = data[1][0].total, result = {};
        var pagination = {
            total: total,
            page: pages.page,
            limit: pages.limit,
            pages: Math.ceil(total / pages.limit)
        };
        result[options.entity] = records;
        result.pagination = pagination;
        return result;
    });
};
