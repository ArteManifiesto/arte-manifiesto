module.exports = function (sequelize, DataTypes) {
    var Work = sequelize.define('Work', {
            name: {
                type: DataTypes.STRING,
                set: function(value) {
                  global.nameSlugify(this, value);
                }
            },
            nameSlugify: DataTypes.STRING,
            photo: DataTypes.STRING,
            description: DataTypes.TEXT,
            public: {type: DataTypes.BOOLEAN, defaultValue: true},
            featured: {type: DataTypes.BOOLEAN, defaultValue: false},
            nsfw: {type: DataTypes.BOOLEAN, defaultValue: false},
            manifest: DataTypes.TEXT,
            onSale: {type: DataTypes.BOOLEAN, defaultValue: false},
            views: {type: DataTypes.INTEGER, defaultValue: 0},
            popularity: {type: DataTypes.INTEGER, defaultValue: 0},
        }, {
            classMethods: {
                associate: function (models) {
                  Work.belongsToMany(models.User, {as: 'WorkViews', through: 'WorkViews'});
                  Work.belongsToMany(models.User, {as: 'WorkLikes', through: 'WorkLikes'});
                  Work.belongsToMany(models.User, {as: 'WorkRequests', through: 'WorkRequests'});
                  Work.belongsToMany(models.Collection, {through: 'CollectionWork'});
                  Work.belongsToMany(models.Tag, {through: 'WorkTags'});

                  Work.belongsTo(models.User);
                  Work.belongsTo(models.Category);

                  Work.hasMany(models.Review, {onDelete: 'cascade'});
                }
            },
            instanceMethods: {
                like: function (user) {
                    var scope = this;
                    this.popularity += 3;
                    var promises = [user.addWorkLike(this), this.save()];
                    return global.db.Sequelize.Promise.all(promises).then(function () {
                        return scope.numOfLikes();
                    });
                },
                unLike: function (user) {
                    var scope = this;
                    this.popularity -= 3;
                    var promises = [user.removeWorkLike(this), this.save()];
                    return global.db.Sequelize.Promise.all(promises).then(function () {
                        return scope.numOfLikes();
                    });
                },
                buildParts: function (options) {
                    var scope = this;
                    return global.db.Sequelize.Promise.all([
                        scope.numOfLikes(),
                        scope.liked(options.viewer),
                        scope.friends(options.viewer),
                        scope.requested(options.viewer),
                    ]).then(function (result) {
                        if(scope.User) {
                          scope.setDataValue('owner' , (scope.User.id === options.viewer));
                        }
                        scope.setDataValue('likes', result[0]);
                        scope.setDataValue('liked', result[1]);
                        scope.setDataValue('friends', result[2]);
                        scope.setDataValue('requested', result[3]);
                    });
                },
                neighbors: function() {
                  var promises = [
                    global.db.Work.max('id', {where:{id:{ lt: this.id}}, addUser: true}),
                    global.db.Work.min('id', {where:{id:{ gt: this.id}}, addUser: true})
                  ];
                  return global.db.Sequelize.Promise.all(promises).then(function (data) {
                    var prev = parseInt(data[0], 10), next = parseInt(data[1], 10);
                    promises = [];
                    !global._.isNaN(prev) && promises.push(global.db.Work.find({where:{id: prev}, addUser: true}))
                    !global._.isNaN(next) && promises.push(global.db.Work.find({where:{id: next}, addUser: true}))
                    return global.db.Sequelize.Promise.all(promises).then(function(result) {
                      if(result.length > 1)
                        return {prev: result[0], next:result[1]};
                      !global._.isNaN(prev) && (neighbors = {prev: result[0], next: null});
                      !global._.isNaN(next) && (neighbors = {prev: null, next: result[0]});
                      return neighbors;
                    });
                  });
                },
                numOfLikes: function () {
                    var scope = this,
                        query = {
                            attributes: [
                                [global.db.sequelize.fn('COUNT', global.db.sequelize.col('id')), 'total']
                            ]
                        };
                    return this.getWorkLikes(query).then(function (result) {
                        return result[0].getDataValue('total');
                    });
                },
                requested: function (viewer) {
                    var scope = this, query = {where: {id: viewer}};
                    return this.getWorkRequests(query).then(function (requests) {
                        return requests.length > 0;
                    });
                },
                liked: function (viewer) {
                    var scope = this, query = {where: {id: viewer}};
                    return this.getWorkLikes(query).then(function (likes) {
                        return likes.length > 0;
                    });
                },
                friends: function (viewer) {
                    if (viewer < 0)
                        return [];

                    var scope = this, queryLikes = {attributes: ['id']},
                        queryFollowings = {attributes: ['id', 'username', 'photo']};

                    var promises = [
                        this.getWorkLikes(queryLikes),
                        global.db.User.findById(viewer).then(function (user) {
                            return user.getFollowings(queryFollowings);
                        })
                    ]
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
                    var query = {attributes: ['id', 'username', 'photo'], limit: 50};
                    return this.getWorkLikes(query);
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
                        return category.getWorks(query);
                    });
                },
                more: function () {
                    var query = {
                        where: {id: {$not: [this.id]}, public: true},
                        order: [global.db.sequelize.fn('RAND')],
                        limit: 6,
                        addUser: true
                    };
                    return this.getUser().then(function (user) {
                        return user.getWorks(query);
                    });
                },
                addToCollection: function (options) {
                    var scope = this, promises = [];
                    return this.removeLegacy(options).then(function(newCollectionsIds){
                      if (newCollectionsIds.length < 1) return;

                      var query = {where: {id: {$in: newCollectionsIds}}};
                      return global.db.Collection.findAll(query).then(function(collections){
                        for (i = 0; i < collections.length; i++) {
                            collection = collections[i];
                            promises.push(collection.addWork(scope));
                        }
                        return global.db.Sequelize.Promise.all(promises);
                      });
                    });
                },
                removeLegacy: function(options) {
                  var scope = this, query = {where: {UserId: options.viewer}};

                  return this.getCollections(query).then(function (collections) {
                      var currentIds = global._.pluck(collections , 'id');
                      currentIds = currentIds || [];
                      var newIds = options.collections;
                      var oldCollectionsIds = global._.difference(currentIds, newIds);
                      var newCollectionsIds = global._.difference(newIds, currentIds);
                      var i, collection, promises = [];
                      for (i = 0; i < oldCollectionsIds.length; i++) {
                          collection = global._.where(collections, {id: oldCollectionsIds[i]})[0];
                          promises.push(collection.removeWork(scope));
                      }
                      return global.db.Sequelize.Promise.all(promises).then(function (result) {
                          return newCollectionsIds;
                      });
                  });
                }
            },
            hooks: {
              beforeFind: global.beforeFind,
              afterFind: global.afterFind
            }
        }
    );
    return Work;
};
