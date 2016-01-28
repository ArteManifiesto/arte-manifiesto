var basePath = 'blog/';
var moment = require('moment');

/**
 * search posts pagination
 * @return {JSON} return posts
 */
var searchPosts = function (req, options, query) {
  options = options || {entity: 'Post'};

  query = query || {};
  query = global._.assign(query, {
    order: [global.getOrder('newest')],
    addUser: true,
    build: true,
    include: [global.db.Category],
    viewer: req.viewer
  });

  if (query.where)
    query.where.published = !query.draft;
  else
    query.where = {published: !query.draft};

  console.log('query : ', JSON.stringify(query.where));

  var page = req.params.page ? req.params.page : 'page-1';
  options.limit = global.limits.blog;
  options.page = page;

  return global.getPaginationEntity(options, query);
};


/**
 * retrieve top featured posts
 * @return {JSON} return ids and the first three featured posts
 */
var getFeaturedTopPosts = function () {
  return global.db.Post.findAll({
    where: {featured: true, published: true},
    order: [global.getOrder('newest')],
    addUser: true,
    build: true,
    limit: 3,
    include: [global.db.Category]
  }).then(function (featureds) {
    var ids = [0];
    for (var i = 0; i < featureds.length; i++) {
      featureds[i] = featureds[i].toJSON();
      ids.push(featureds[i].id);
    }
    return {featureds: featureds, ids: ids};
  });
};

/**
 * get categorias filtered by meta = 1
 */
var getCategories = function () {
  var categoriesQuery = {where: {meta: 1}};
  return global.db.Category.findAll(categoriesQuery);
};

/**
 * list all the blog's posts
 * @return {HTML} return the main view
 */
exports.index = function (req, res) {
  var promises = [
    getFeaturedTopPosts(),
    getCategories()
  ];
  global.db.sequelize.Promise.all(promises).then(function (data) {
    var topPosts = data[0], categories = data[1];
    var postsQuery = {where: {id: {$not: topPosts.ids}}};
    searchPosts(req, null, postsQuery).then(function (posts) {
      return res.render(basePath + 'index', {
        data: posts,
        featureds: topPosts.featureds,
        categories: categories
      });
    });
  });
};

/**
 * get posts exluding the first three feature posts
 * @return {JSON} return posts in json format
 */
exports.posts = function (req, res) {
  getFeaturedTopPosts().then(function (topPosts) {
    var postsQuery = {where: {id: {$not: topPosts.ids}}};
    searchPosts(req, null, postsQuery).then(function (posts) {
      return res.json(posts);
    });
  });
};

/**
 * this method is responsible to build posts
 * @return {HTML} return the creator view
 */
exports.creator = function (req, res) {
  getCategories().then(function (categories) {
    return res.render(basePath + 'creator', {
      cloudinary: global.cl,
      cloudinayCors: global.cl_cors,
      categories: categories
    });
  });
};

/**
 * filter posts by category
 * @return {HTML} return the category view
 */
exports.category = function (req, res) {
  var query = {where: {nameSlugify: req.params.category}};
  global.db.Category.find(query).then(function (category) {
    if (!category) {
      req.flash('errorMessage', 'Categoría no existe');
      return res.redirect('/blog');
    }

    getCategories().then(function (categories) {
      var options = {
        entity: category, method: 'getPosts',
        tempEntity: 'Post', association: true
      };

      searchPosts(req, options).then(function (posts) {
        res.render(basePath + 'category', {
          category: category,
          categories: categories,
          posts: posts
        });
      });
    });
  });
};

/**
 * retrieve unpublished posts
 * @return {HTML} return the draft view
 */
exports.draft = function (req, res) {
  var postsQuery = {draft: true};
  var promises = [
    getCategories(),
    searchPosts(req, null, postsQuery)
  ];
  global.db.sequelize.Promise.all(promises).then(function (data) {
    res.render(basePath + 'draft', {
      categories: data[0],
      posts: data[1]
    });
  });
};
