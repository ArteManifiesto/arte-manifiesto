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
                        return global.getNumLikesOfWork({work: scope.id});
                    });
                },
                unLike: function (user) {
                    var scope = this;
                    return user.removeWorkLike(this).then(function () {
                        return global.getNumLikesOfWork({work: scope.id});
                    });
                },
                numOfLikes: function () {
                    var scope = this,
                        query = {
                            attributes: [
                                [global.db.sequelize.fn('COUNT', global.db.sequelize.col('id')), 'numOfLikes']
                            ]
                        };
                    return this.getWorkLikes(query).then(function (result) {
                        return result[0].getDataValue('numOfLikes');
                    });
                },
                liked: function (viewer) {
                    var scope = this, query = {where: {id: viewer}};
                    return this.getWorkLikes(query).then(function (likes) {
                        return likes.length > 0;
                    });
                }
            },
            hooks: {
                afterCreate: function (work, options) {
                    work.url = options.user.url + '/work/' + work.nameSlugify;
                    return work.save();
                }
            }
        }
    );
    return Work;
};
