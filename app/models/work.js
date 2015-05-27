var _ = require('lodash');

var Chance = require('chance');
var chance = new Chance();

module.exports = function (sequelize, DataTypes) {
    var Work = sequelize.define('Work', {
            name: {
                type: DataTypes.STRING,
                set: function (value) {
                    this.setDataValue('nameSlugify', global.slugify(value));
                    this.setDataValue('name', value);
                }
            },
            nameSlugify: DataTypes.STRING,
            photo: DataTypes.STRING,
            description: DataTypes.TEXT,
            public: {type: DataTypes.BOOLEAN, defaultValue: true},
            featured: {type: DataTypes.BOOLEAN, defaultValue: false},
            views: {type: DataTypes.INTEGER, defaultValue: 0},
            url: {type: DataTypes.STRING},
            popularity: {type: DataTypes.INTEGER, defaultValue: 0}
        }, {
            classMethods: {
                associate: function (models) {
                    Work.belongsToMany(models.User, {as: 'WorkLikes', through: 'WorkLikes'});

                    Work.belongsToMany(models.Category, {through: 'WorkCategories'});
                    Work.belongsToMany(models.Tag, {through: 'WorkTags'});

                    Work.belongsTo(models.User, {onDelete: 'cascade'});

                    Work.hasMany(models.Product);
                }
            },
            instanceMethods: {
                like: function (user) {
                    var scope = this;
                    return user.addWorkLike(this).then(function () {
                        return scope.numOfLikes();
                    });
                },
                unLike: function (user) {
                    var scope = this;
                    return user.removeWorkLike(this).then(function () {
                        return scope.numOfLikes();
                    });
                },
                buildParts: function (options) {
                    var scope = this;
                    return global.db.Sequelize.Promise.all([
                        scope.numOfLikes(),
                        scope.liked(options.viewer),
                        scope.friends(options.viewer)
                    ]).then(function (result) {
                        scope.setDataValue('likes', result[0]);
                        scope.setDataValue('liked', result[1]);
                        scope.setDataValue('friends', result[2]);
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
                        queryFollowings = {attributes: ['id', 'username', 'photo', 'url']};

                    var promises = [
                        this.getWorkLikes(queryLikes),
                        global.db.User.findById(viewer).then(function (user) {
                            return user.getFollowings(queryFollowings);
                        })
                    ]
                    return global.db.Sequelize.Promise.all(promises).then(function (result) {
                        var likes = result[0], followings = result[1];

                        var likesId = _.pluck(likes, 'id');
                        var followingsId = _.pluck(followings, 'id');
                        var intersection = _.intersection(likesId, followingsId);
                        var i, friends = [];
                        for (i = 0; i < intersection.length; i++)
                            friends.push(_.where(followings, {id: intersection[i]})[0]);

                        return friends;
                    });
                }
            },
            hooks: {
                afterCreate: function (work, options) {
                    work.url = options.user.url + '/work/' + work.nameSlugify;
                    return work.save();
                },
                afterFind: function (items, options, fn) {
                    if ((items === null) ||
                        (_.isArray(items) && items.length < 1))
                        return fn(null, options);

                    if (options.build) {
                        var promises = [];
                        var addPromise = function (item) {
                            if (options.build)
                                promises.push(item.buildParts(options));
                        };

                        if (!_.isArray(items))
                            addPromise(items);

                        for (var i = 0; i < items.length; i++)
                            addPromise(items[i]);

                        return global.db.Sequelize.Promise.all(promises).then(function () {
                            return fn(null, options);
                        });
                    }
                    return fn(null, options);
                }
            }
        }
    );
    return Work;
};
