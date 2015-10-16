var crypto = require('crypto');
var uuid = require('node-uuid');
var moment = require('moment');
var _ = require('lodash');
var Chance = require('chance');
var chance = new Chance();

module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define('User', {
            username: DataTypes.STRING,
            email: DataTypes.STRING,
            firstname: DataTypes.STRING,
            lastname: DataTypes.STRING,
            fullname: DataTypes.STRING,
            gender: DataTypes.STRING,
            photo: DataTypes.STRING,
            cover: DataTypes.STRING,
            isArtist: {type: DataTypes.BOOLEAN, defaultValue: false},

            city: DataTypes.STRING,
            country: DataTypes.STRING,
            biography: DataTypes.TEXT,
            birthday: DataTypes.DATE,

            school: DataTypes.STRING,

            facebook: DataTypes.STRING,
            behance: DataTypes.STRING,
            twitter: DataTypes.STRING,
            tumblr: DataTypes.STRING,

            featured: {type: DataTypes.BOOLEAN, defaultValue: false},
            views: {type: DataTypes.INTEGER, defaultValue: 0},
            url: {type: DataTypes.STRING},
            popularity: {type: DataTypes.INTEGER, defaultValue: 0},

            hashedPassword: DataTypes.STRING,
            salt: DataTypes.STRING,

            isAdmin: {type: DataTypes.BOOLEAN, defaultValue: false},
            verified: {type: DataTypes.BOOLEAN, defaultValue: false},
            filled: {type: DataTypes.BOOLEAN, defaultValue: false},

            tokenVerifyEmail: DataTypes.STRING,
            tokenResetPassword: DataTypes.STRING,
            tokenResetPasswordExpires: DataTypes.DATE
        },
        {
            classMethods: {
                associate: function (models) {
                    User.belongsToMany(models.Category, {as: 'Specialties', through: 'Specialties'});
                    User.belongsToMany(models.Category, {as: 'Interests', through: 'Interests'});

                    User.belongsToMany(models.User, {as: 'Followers', foreignKey: 'FollowingId', through: 'Followers'});
                    User.belongsToMany(models.User, {as: 'Followings', foreignKey: 'FollowerId', through: 'Followers'});

                    User.belongsToMany(models.Work, {as: 'WorkLikes', through: 'WorkLikes'});

                    User.belongsToMany(models.Product, {as: 'ProductLikes', through: 'ProductLikes'});
                    User.belongsToMany(models.Product, {as: 'ProductCollects', through: 'ProductCollects'});
                    User.belongsToMany(models.Product, {as: 'ProductBuyers', through: 'ProductBuyers'});
                    
                    User.hasMany(models.Collection);
                    User.hasMany(models.Work);
                    User.hasMany(models.Product);
                }
            },
            instanceMethods: {
                makeSalt: function () {
                    return crypto.randomBytes(16).toString('base64');
                },
                authenticate: function (password) {
                    return this.encryptPassword(password, this.salt) === this.hashedPassword;
                },
                encryptPassword: function (password, salt) {
                    if (!password || !salt) return '';
                    salt = new Buffer(salt, 'base64');
                    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
                },
                makeTokenResetPassword: function () {
                    this.tokenResetPassword = uuid.v4();
                    this.tokenResetPasswordExpires = moment().add(1, 'hour');
                    return this.save();
                },
                follow: function (user) {
                    var scope = this;
                    user.popularity += 3;
                    var promises = [user.addFollower(this), user.save()];
                    return global.db.Sequelize.Promise.all(promises).then(function () {
                        return user.numOfFollowers();
                    });
                },
                unFollow: function (user) {
                    var scope = this;
                    user.popularity -= 3;
                    var promises = [user.removeFollower(this), user.save()];
                    return global.db.Sequelize.Promise.all(promises).then(function () {
                        return user.numOfFollowers();
                    });
                },
                buildParts: function (options) {
                    var scope = this, worksQuery = {
                        attributes: ['id', 'name', 'photo', 'url'],
                        limit: 4
                    };
                    return global.db.Sequelize.Promise.all([
                        scope.numOfFollowers(),
                        scope.numOfWorks(),
                        scope.following(options.viewer),
                        scope.getWorks(worksQuery)
                    ]).then(function (result) {
                        scope.setDataValue('numOfFollowers', result[0]);
                        scope.setDataValue('numOfWorks', result[1]);
                        scope.setDataValue('following', result[2]);
                        scope.setDataValue('Works', result[3]);
                    });
                },
                numOfCollections: function (query) {
                    var scope = this;
                    query = _.assign(query, {
                        attributes: [
                            [global.db.sequelize.fn('COUNT', global.db.sequelize.col('Collection.id')), 'numOfCollections']
                        ]
                    });
                    return this.getCollections(query).then(function (result) {
                        return result[0].getDataValue('numOfCollections');
                    });
                },
                numOfFollowers: function () {
                    var scope = this,
                        query = {
                            attributes: [
                                [global.db.sequelize.fn('COUNT', global.db.sequelize.col('id')), 'numOfFollowers']
                            ]
                        };
                    return this.getFollowers(query).then(function (result) {
                        return result[0].getDataValue('numOfFollowers');
                    });
                },
                numOfFollowings: function () {
                    var scope = this,
                        query = {
                            attributes: [
                                [global.db.sequelize.fn('COUNT', global.db.sequelize.col('id')), 'numOfFollowings']
                            ]
                        };
                    return this.getFollowings(query).then(function (result) {
                        return result[0].getDataValue('numOfFollowings');
                    });
                },
                numOfWorks: function () {
                    var scope = this,
                        query = {
                            attributes: [
                                [global.db.sequelize.fn('COUNT', global.db.sequelize.col('id')), 'numOfWorks']
                            ]
                        };
                    return this.getWorks(query).then(function (result) {
                        return result[0].getDataValue('numOfWorks');
                    });
                },
                numOfProducts: function () {
                    var scope = this,
                        query = {
                            attributes: [
                                [global.db.sequelize.fn('COUNT', global.db.sequelize.col('id')), 'numOfProducts']
                            ]
                        };
                    return this.getProducts(query).then(function (result) {
                        return result[0].getDataValue('numOfProducts');
                    });
                },
                numOfLikesToWorks: function () {
                    var scope = this,
                        query = {
                            attributes: [
                                [global.db.sequelize.fn('COUNT', global.db.sequelize.col('id')), 'numOfLikesToWorks']
                            ]
                        };
                    return this.getWorkLikes(query).then(function (result) {
                        return result[0].getDataValue('numOfLikesToWorks');
                    });
                },
                numOfLikesToProducts: function () {
                    var scope = this,
                        query = {
                            attributes: [
                                [global.db.sequelize.fn('COUNT', global.db.sequelize.col('id')), 'numOfLikesToProducts']
                            ]
                        };
                    return this.getProductLikes(query).then(function (result) {
                        return result[0].getDataValue('numOfLikesToProducts');
                    });
                },
                following: function (viewer) {
                    var scope = this, query = {where: {id: viewer}};
                    return this.getFollowers(query).then(function (followers) {
                        return followers.length > 0;
                    });
                }
            },
            hooks: {
                afterCreate: function (user, options) {
                    options.password = options.password || '123';
                    user.salt = user.makeSalt();
                    user.hashedPassword = user.encryptPassword(options.password, user.salt);
                    user.tokenVerifyEmail = uuid.v4();
                    user.url = '/user/' + user.username;
                    user.fullname = user.firstname + ' ' + user.lastname;

                    var promises = [
                        user.save(),
                        global.db.Collection.create({
                            name: 'Tienda',
                            meta: 'store',
                            needGenerate: false
                        }, {user: user}),
                        global.db.Collection.create({
                            name: 'Deseos',
                            meta: 'products',
                            description: 'Cosas que me encataria tener un dia.',
                            needGenerate: false
                        }, {user: user}),
                        global.db.Collection.create({
                            name: 'Regalos', meta: 'products',
                            description: 'Buenas ideas para regalos.',
                            needGenerate: false
                        }, {user: user})
                    ];
                    return global.db.Sequelize.Promise.all(promises).then(function (data) {
                        var ids = [1, 2, 3, 4, 5, 7, 8, 9, 10];
                        promises = [
                            user.addCollections(data.slice(1, data.length)),
                            global.db.Category.findAll({
                                where: {id: {in: _.take(ids, _.random(1, 5))}}
                            }),
                            global.db.Tag.findAll({
                                where: {id: {in: _.take(ids, _.random(1, 5))}}
                            })
                        ];
                        var i;
                        for (i = 0; i < 3; i++) {
                            promises.push(global.db.Work.create({
                                name: chance.name(),
                                description: "We weren't quite sure what to expect, but you blew us away—with everything from direct, powerful descriptions of your work to rhymes and poems to even a Vine resume.",
                                photo: '/img/works/work' + (_.random(1, 12).toString()) + '.jpg',
                                public: true
                            }, {user: user}));
                        }

                        return global.db.Sequelize.Promise.all(promises).then(function (data) {
                            var categories = data[1], tags = data[2], works = data.slice(3, data.length);
                            var work, promises = [];
                            for (i = 0; i < works.length; i++) {
                                work = works[i];
                                promises.push(work.setUser(user));
                                promises.push(work.setCategories(categories));
                                promises.push(work.setTags(tags));
                            }
                            return global.db.Sequelize.Promise.all(promises).then(function () {
                                promises = [
                                    global.db.ProductType.findAll({
                                        where: {id: _.random(1, 5)},
                                        limit: 1
                                    })
                                ];
                                var i;
                                for (i = 0; i < 3; i++) {
                                    promises.push(global.db.Product.create({
                                        name: chance.name(),
                                        price: _.random(100, 1000),
                                        photo: '/img/products/product' + (_.random(1, 20).toString()) + '.jpg',
                                        description: chance.paragraph(),
                                        public: true,
                                        WorkId: works[i].id,
                                        featured: _.sample([true, false])
                                    }, {user: user}));
                                }
                                return global.db.Sequelize.Promise.all(promises).then(function (data) {
                                    var types = data[0][0], products = data.slice(1, data.length);
                                    var product, promises = [];
                                    for (i = 0; i < products.length; i++) {
                                        product = products[i];
                                        promises.push(product.setUser(user));
                                        promises.push(product.setProductType(types));
                                    }
                                    return global.db.Sequelize.Promise.all(promises).then(function () {

                                    });
                                });
                            });
                        });

                    });
                },
                afterFind: function (items, options, fn) {
                    if ((!options.build) || (items === null) ||
                        (_.isArray(items) && items.length < 1))
                        return fn(null, options);

                    if (!_.isArray(items)) {
                        return items.buildParts(options).then(function () {
                            return fn(null, options);
                        });
                    }

                    var i, promises = [];
                    for (i = 0; i < items.length; i++)
                        promises.push(items[i].buildParts(options));
                    return global.db.Sequelize.Promise.all(promises).then(function () {
                        return fn(null, options);
                    });
                }
            }
        }
    );
    return User;
};
