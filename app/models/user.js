var crypto = require('crypto');

module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define('User',
        {
            username: DataTypes.STRING,
            email: DataTypes.STRING,
            firstname: DataTypes.STRING,
            lastname: DataTypes.STRING,
            gender: DataTypes.STRING,
            provider: DataTypes.STRING,
            facebookUserId: DataTypes.BIGINT(30),
            facebookUrlProfile: DataTypes.STRING,
            photo: DataTypes.STRING,
            hashedPassword: DataTypes.STRING,
            salt: DataTypes.STRING,
            isArtist: DataTypes.BOOLEAN
        }, {
            classMethods: {
                associate: function (models) {
                    User.hasOne(models.SpecificData);
                    //TODO make associations with stores
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
                }
            },
            hooks: {
                afterCreate: function (user, options) {
                    if (user.provider == 'local') {
                        user.salt = user.makeSalt();
                        user.hashedPassword = user.encryptPassword(options.password, user.salt);
                        return user.save();
                    }
                }
            }
        }
    );
    return User;
};
