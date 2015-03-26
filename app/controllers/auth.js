/**
 * dependencies
 */
var passport = require('passport');

/**
 * User signup
 */
exports.signup = function (req, res) {
    global.db.User.find({
        where: {
            email: req.body.email
        }
    }).then(function (user) {
        if (!user) {
            var userData = {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                gender: req.body.gender,
                provider: 'local',
                isArtist: req.body.isArtist
            };

            global.db.User.create(userData, {
                password: req.body.password
            }).then(function (user) {
                loginUser(req, res, user);
            });
        } else {
            return res.json({
                code: 203,
                message: 'User exists'
            });
        }
    })
};

/**
 * Login user after signup or when the user exists
 */
var loginUser = function (req, res, user) {
    req.login(user, {}, function (err) {
        if (err) {
            return res.json({
                code: 205,
                message: 'Cannot login'
            });
        }

        global.db.User.find(user.id).then(function (user) {
            req.user = user;

            return res.json({
                code: 202,
                message: 'User logged',
                user: req.user
            });
        });
    });
};

/**
 * User login
 */
exports.login = function (req, res) {
    passport.authenticate('local', function (err, user) {
        if (err) {
            return res.json({
                code: 205,
                message: err.message
            });
        }

        if (!user) {
            return res.json({
                code: 205,
                error: "User dont' exists"
            });
        }
        loginUser(req, res, user);
    })(req, res);
};

/**
 * User logout
 */
exports.logout = function (req, res) {
    req.logout();
    if (req.xhr) {
        return res.json({
            code: 202,
            message: 'User logout'
        });
    } else {
        return res.redirect('/');
    }
};