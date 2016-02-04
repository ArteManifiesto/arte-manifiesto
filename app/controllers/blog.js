var basePath = 'blog/';
var moment = require('moment');

/**
 * search posts using pagination, one day a girl told me I need to
 * paginate my cock because of the longitud :]
 */
var searchPosts = function (req, options, query) {
  options = options || {entity: 'Post'};

  query = query || {};
  query = global._.assign(query, {
    attributes: ['id', 'name', 'nameSlugify', 'photo', 'description', 'published', 'featured',
    'views', 'popularity', 'createdAt', 'updatedAt'],
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
 * get top featured posts, I don't realize why I am doing this kind
 * of comments in my code, but it's funny :P
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
 * meta = 1, categories that belongs to posts
 */
var getCategories = function () {
  var categoriesQuery = {where: {meta: 1}};
  return global.db.Category.findAll(categoriesQuery);
};

/**
 * list all the blog's posts, as well as
 * the best three featured posts
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
 * get posts exluding the first three feature posts, because
 * their are in top =]
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
 * this method is responsible for building the posts, yep it is.
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
 * filter posts by category, you should create a category called porn,
 * trust me it'll generate lots of traffic ;)
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
 * get unpublished posts, maybe you want to tell the dumb editor
 * that it's such a bad place to stay the post?, I didn't work vainly
 * in this damn editor -.-
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
