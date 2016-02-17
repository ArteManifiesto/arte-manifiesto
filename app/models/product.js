var _ = require('lodash');
module.exports = function (sequelize, DataTypes) {
    var Product = sequelize.define('Product', {
            name: {
              type: DataTypes.STRING,
              set: function (value) {
                global.nameSlugify(this, value);
              }
            },
            nameSlugify: DataTypes.STRING,
            price: DataTypes.STRING,
            finalPrice: DataTypes.STRING,
            photo: DataTypes.STRING,
            description: DataTypes.TEXT,
            published: {type: DataTypes.BOOLEAN, defaultValue: false},
            featured: {type: DataTypes.BOOLEAN, defaultValue: false},
            views: {type: DataTypes.INTEGER, defaultValue: 0},
            popularity: {type: DataTypes.INTEGER, defaultValue: 0}
        }, {
            classMethods: {
                associate: function (models) {
                    Product.belongsToMany(models.User, {as: 'ProductViews', through: 'ProductViews'});
                    Product.belongsToMany(models.User, {as: 'ProductLikes', through: 'ProductLikes'});
                    Product.belongsToMany(models.User, {as: 'ProductBuyers', through: 'ProductBuyers'});
                    Product.belongsToMany(models.Collection, {through: 'CollectionProduct'});
                    Product.belongsToMany(models.Tag, {through: 'ProductTags'});

                    Product.belongsTo(models.Work, {onDelete: 'cascade'});
                    Product.belongsTo(models.User, {onDelete: 'cascade'});
                    Product.belongsTo(models.Category);
                    // Product.hasMany(models.Review, {onDelete: 'cascade'});
                }
            },
            instanceMethods: {
                view: function () {
                  this.views += 1;
                  this.popularity += 1;
                  return this.save();
                },
                like: function (user) {
                  var scope = this;
                  return user.addProductLike(this).then(function () {
                    return scope.numOfLikes().then(function (likes) {
                      scope.popularity = scope.views + (likes * 50);
                      return scope.save().then(function () {
                        return likes;
                      });
                    });
                  });
                },
                buildParts: function (options) {
                    var scope = this;
                    return global.db.Sequelize.Promise.all([
                        scope.likes(),
                        scope.liked(options.viewer),
                        scope.friends(options.viewer)
                    ]).then(function (result) {
                        scope.setDataValue('likes', result[0]);
                        scope.setDataValue('liked', result[1]);
                        scope.setDataValue('friends', result[2]);
                    });
                },
                likes: function () {
                    var scope = this, query = {
                        attributes: [
                            [global.db.sequelize.fn('COUNT', global.db.sequelize.col('id')), 'likes']
                        ]
                    }
                    return this.getProductLikes(query).then(function (result) {
                        return result[0].getDataValue('likes');
                    });
                },
                liked: function (viewer) {
                    var scope = this, query = {where: {id: viewer}};
                    return this.getProductLikes(query).then(function (likes) {
                        return likes.length > 0;
                    });
                },
                friends: function (viewer) {
                  if (viewer < 0)
                    return [];

                  var scope = this, queryLikes = {attributes: ['id']},
                    queryFollowings = {attributes: ['id', 'username', 'photo']};

                  var promises = [
                    this.getProductLikes(queryLikes),
                    global.db.User.findById(viewer).then(function (user) {
                      return user.getFollowings(queryFollowings);
                    })
                  ];
                  return global.db.Sequelize.Promise.all(promises).then(function (result) {
                    var likes = result[0], followings = result[1];

                    var likesId = global._.pluck(likes, 'id');
                    var followingsId = global._.pluck(followings, 'id');
                    var intersection = global._.intersection(likesId, followingsId);
                    var i, friends = [];
                    for (i = 0; i < intersection.length; i++)
                      friends.push(global._.where(followings, {id: intersection[i]})[0]);

                    return friends;
                  });
                },
                userLikes: function () {
                    var query = {attributes: ['id', 'username', 'photo', 'url'], limit: 50};
                    return this.getProductLikes(query);
                },
                similar: function (viewer) {
                  var scope = this;
                  return this.getCategory().then(function (category) {
                    var query = {
                      where: {id: {$not: [scope.id]}},
                      addUser: true,
                      order: [global.db.sequelize.fn('RAND')],
                      limit: 10, build: true, viewer: viewer
                    };
                    return category.getProducts(query);
                  });
                },
                more: function () {
                  var query = {
                    where: {id: {$not: [this.id]}},
                    order: [global.db.sequelize.fn('RAND')],
                    limit: 6,
                    addUser: true
                  };
                  return this.getUser().then(function (user) {
                    return user.getProducts(query);
                  });
                }
            },
            hooks: {
              beforeFind: global.beforeFind,
              afterFind: global.afterFind
            }
        }
    );
    return Product;
};
