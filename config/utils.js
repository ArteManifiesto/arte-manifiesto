var _ = require('lodash');
var moment = require('moment');

global.config = {
    entities: ['works', 'users'],
    orders: ['newest', 'oldest', 'popularity', 'views'],
    times: ['day', 'week', 'month', 'year'],
    filters: {
        works: ['category', 'tag', 'title'],
        users: ['specialty', 'name', 'username']
    },
    params: {
        works: ['entity', 'order', 'time', 'featured'],
        users: ['entity', 'order', 'time', 'featured']
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


global.search = function (entity, req) {

    //works/tag/wonderful?order=(popularity,views)&time=(week,month,year,all)&type=featured
    //works/tag/wonderful?order=newest&type=featured

    //works/category/paint?order=(popularity,views)&time=(week,month,year,all)&type=featured
    //works/category/paint?order=newest&type=featured

    //works/?title=art-jam&order=(popularity,views)&time=(week,month,year,all)&type=featured
    //works/?title=art-jam&order=newest&type=featured

    //works/tag/wonderful?order=(popularity,views)&time=(week,month,year,all)&type=featured
    //works/tag/wonderful?order=newest&type=featured

    //users/specialty/paint?order=(popularity,views)&time=(week,month,year,all)&type=featured
    //users/specialty/paint?order=newest&type=featured

    //users/?name=Julio&lastname=Canares&order=(popularity,views)&time=(week,month,year,all)&type=featured
    //users/?username=juliocanares


    /*var entityRefactor = _.capitalize(entity.substring(0, entity.length - 1));
     var model = global.db[entityRefactor];

     var pagination = global.getPagination({page: req.query.page});

     var orders = {
     work: ['newest', 'oldest', 'likes'],
     user: ['newest', 'oldest']
     };

     var currentOrder = orders[String(entityRefactor).toLowerCase()];
     var order = global.getOrder(currentOrder, req.query.order);

     switch (order) {
     case 'newest':
     order = '`createdAt` DESC';
     break;
     case 'oldest':
     order = '`createdAt` ASC';
     break;
     case 'likes':
     order = '`likes` DESC';
     break;
     }

     var getCurrentCategoryQuery = {where: {nameSlugify: req.params.category}};
     return global.db.Category.find(getCurrentCategoryQuery).then(function (category) {
     var query = {offset: pagination.offset, limit: pagination.limit, order: order};

     var showResult = function (works, total) {
     var totalPages = Math.ceil(total / pagination.limit);
     return {
     works: works,
     pagination: {
     total: total,
     current_page: pagination.page < totalPages ? pagination.page : 0,
     total_pages: totalPages
     }
     }
     };

     if (category) {
     var countQuery = 'SELECT count(CASE WHEN `CategoryId` = ? THEN 1 END) AS `total` FROM `CategoriesWorks`';
     var countQueryOptions = {replacements: [category.id], type: global.db.sequelize.QueryTypes.SELECT};
     return global.db.sequelize.query(countQuery, countQueryOptions).then(function (result) {
     var total = result[0].total;
     return category.getWorks(query).then(function (works) {
     return showResult(works, total);
     });
     });
     } else {
     return global.db.Work.count().then(function (total) {
     return global.db.Work.findAll(query).then(function (works) {
     return showResult(works, total);
     });
     });
     }
     });*/
};


/*
 var query = {offset: offset, limit: limit, order: order};

 var showResult = function (works, total) {
 return res.json({
 categories: categories,
 works: works,
 pagination: {current_page: page, total: total, total_pages: Math.ceil(total / limit)}
 })
 };

 if (category) {
 var countQuery = 'SELECT count(CASE WHEN `CategoryId` = ? THEN 1 END) AS `total` FROM `CategoriesWorks`';
 var countQueryOptions = {replacements: [category.id], type: global.db.sequelize.QueryTypes.SELECT};
 global.db.sequelize.query(countQuery, countQueryOptions).then(function (result) {
 var total = result[0].total;
 category.getWorks(query).then(function (works) {
 showResult(works, total);
 });
 });
 } else {
 global.db.Work.count().then(function (total) {
 global.db.Work.findAll(query).then(function (works) {
 showResult(works, total);
 });
 });
 }*/



//works/tag/wonderful?order=(popularity,views)&time=(week,month,year,all)&type=featured
//works/tag/wonderful?order=newest&type=featured

//works/category/paint?order=(popularity,views)&time=(week,month,year,all)&type=featured
//works/category/paint?order=newest&type=featured

//works/title/art-jam?order=(popularity,views)&time=(week,month,year,all)&type=featured
//works/title/art-jam?order=newest&type=featured

//works/tag/wonderful?order=(popularity,views)&time=(week,month,year,all)&type=featured
//works/tag/wonderful?order=newest&type=featured

//users/specialty/paint?order=(popularity,views)&time=(week,month,year,all)&type=featured
//users/specialty/paint?order=newest&type=featured

//users/name/Julio?order=(popularity,views)&time=(week,month,year,all)&type=featured
//users/username/juliocanares

//products/type/originals/
//products/type/originals/?order=(popularity,views)&time=(week,month,year,all)&type=featured&i_price=10&e_price=20

global.searchWorks = function (req) {
    var pagination = global.getPagination(req.params.page, 3);

    var query = {
        where: {},
        offset: pagination.offset,
        limit: pagination.limit
    };

    var orderIndex = ['index','popularity'].indexOf(req.query.order);

    if (req.query.order != 'likes' || req.query.order != 'popularity')
        query.order = global.getOrderFormated(req.query.order);

    if (req.query.time) {
        query.where.createdAt = {
            between: [
                moment().startOf(req.query.time).toDate(),
                moment().toDate()
            ]
        };
    }

    return global.db.Work.findAll(query).then(function (works) {
        return works;
    });
};


global.searchUsers = function (req) {
    return global.db.User.findAll().then(function (users) {
        return users;
    });
};

global.getPagination = function (page, limit) {
    var split = parseInt(page.split('-')[1], 10);
    page = _.isNaN(split) ? 1 : split;
    page = page > 10000 ? 1 : page;
    console.log('page ', page);
    var offset = page > 0 ? ((page - 1) * limit) : 0;
    return {page: page, limit: limit, offset: offset};
};

global.getParameter = function (data, value, offset) {
    var index = data.indexOf(value);
    if (index < 0)index = offset ? offset : 0;
    return data[index];
};

global.encodeToQuery = function (data) {
    var ret = [];
    var param;
    for (param in data)
        ret.push(encodeURIComponent(param) + "=" + encodeURIComponent(data[param]));
    return ret.join("&");
};

global.getOrderFormated = function (order) {
    switch (order) {
        case 'newest':
            order = '`createdAt` DESC';
            break;
        case 'oldest':
            order = '`createdAt` ASC';
            break;
    }
    return order;
};

global.generateUrlWithParams = function (req) {
    return req.protocol + '://' + req.get('host') + req.path + '?' + global.encodeToQuery(req.query);
};