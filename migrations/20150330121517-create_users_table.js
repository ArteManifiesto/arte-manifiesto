"use strict";

module.exports = {
    up: function (migration, DataTypes, done) {
        migration.createTable('users', {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                createdAt: {
                    type: DataTypes.DATE
                },
                updatedAt: {
                    type: DataTypes.DATE
                },
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
            },
            {
                charset: 'utf8'
            });
        // add altering commands here, calling 'done' when finished
        done();
    },

    down: function (migration, DataTypes, done) {
        migration.dropTable('users');
        done();
    }
};
