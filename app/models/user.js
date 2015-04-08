var crypto = require('crypto');
var uuid = require('node-uuid');
var moment = require('moment');

module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define('User', {
            username: DataTypes.STRING,
            email: DataTypes.STRING,
            firstname: DataTypes.STRING,
            lastname: DataTypes.STRING,
            gender: DataTypes.STRING,
            photo: DataTypes.STRING,
            isArtist: DataTypes.BOOLEAN,

            city: DataTypes.STRING,
            country: DataTypes.STRING,
            biography: DataTypes.TEXT,
            birthday: DataTypes.DATE,
            // specialties in associations
            school: DataTypes.STRING,

            //TODO maybe need other table association for social ?
            /* facebook: DataTypes.STRING,
             twitter: DataTypes.STRING,
             instagram: DataTypes.STRING,
             tumblr: DataTypes.STRING,
             behance: DataTypes.STRING,
             web: DataTypes.STRING,*/

            // interests in associations
            hashedPassword: DataTypes.STRING,
            salt: DataTypes.STRING,
            provider: DataTypes.STRING,

            verified: {type: DataTypes.BOOLEAN, defaultValue: false},
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

                    User.hasMany(models.Action);
                    User.hasMany(models.Collection);

                    User.hasMany(models.Work);

                    User.hasMany(models.Like);
                    User.hasMany(models.Collect);
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
                }
            },
            hooks: {
                afterCreate: function (user, options) {
                    options.password = options.password || '123';
                    user.provider = 'local';
                    user.salt = user.makeSalt();
                    user.hashedPassword = user.encryptPassword(options.password, user.salt);
                    user.tokenVerifyEmail = uuid.v4();

                    var promises = [
                        user.save(),
                        global.db.Collection.create({name: 'Portafolio', meta: 'portfolio'}),
                        global.db.Collection.create({name: 'Favoritos', meta: 'work'}),
                        global.db.Collection.create({name: 'Deseos', meta: 'product'}),
                        global.db.Collection.create({name: 'Regalos', meta: 'product'})
                    ];

                    return global.db.Sequelize.Promise.all(promises).then(function (data) {
                        return user.addCollections(data.slice(1, data.length));
                    });
                }
            }
        }
    );
    return User;
};
