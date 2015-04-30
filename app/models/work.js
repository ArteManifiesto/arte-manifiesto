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
            description: DataTypes.TEXT,
            photo: DataTypes.STRING,
            public: {type: DataTypes.BOOLEAN, defaultValue: true},
            featured: {type: DataTypes.BOOLEAN, defaultValue: false}
            //dimension: DataTypes.TEXT
        }, {
            classMethods: {
                associate: function (models) {
                    Work.belongsToMany(models.User, {as: 'WorkLikes', through: 'WorkLikes'});
                    Work.belongsToMany(models.User, {as: 'WorkViews', through: 'WorkViews'});
                    Work.belongsToMany(models.User, {as: 'WorkCollects', through: 'WorkCollects'});

                    Work.belongsTo(models.User, {onDelete: 'cascade'});

                    Work.belongsToMany(models.Collection, {through: models.CollectionWork});

                    Work.belongsToMany(models.Category, {through: 'WorkCategories'});

                    Work.belongsToMany(models.Tag, {through: 'WorkTags'});

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
                }
            }
        }
    );
    return Work;
};
