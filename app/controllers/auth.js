var passport = require('passport');
var moment = require('moment');
var config = require('../../config/config');
var simple_recaptcha = require('simple-recaptcha-new');

/**
 * Show the view page for signup
 */
exports.signupPage = function (req, res) {
    var profileCookie = req.cookies.profile;
    res.clearCookie('profile');
    return res.render('auth/signup', {
        profile: profileCookie
    });
};

/**
 * User signup
 */
exports.signup = function (req, res) {
    console.log(req.body);
    var promises = [
        check('username', req.body.username),
        check('email', req.body.email)
    ];

    global.db.Sequelize.Promise.all(promises).then(function (data) {
        var usernameAvailable = data[0], emailAvailable = data[1], errors = [];

        if (!usernameAvailable)
            errors.push({username: 'username is not available'});

        if (!emailAvailable)
            errors.push({email: 'email is not available'});

        var ip = req.ip, response = req.body['g-recaptcha-response'];

        simple_recaptcha(config.recaptcha.privateKey, ip, response, function (error) {
            if (error)
                errors.push({recaptch: 'recaptcha not match'});

            if (errors.length > 0)
                return res.conflict(errors);

            var options = {password: req.body.password};
            
            global.db.User.create(req.body, options).then(function (user) {
                var params = {
                    to: user.email, user: user.firstname,
                    url: req.protocol + '://' + req.get('host') +
                    '/auth/verify/' + user.tokenVerifyEmail
                };

                global.emails.verify(params).then(function () {
                    loginUser(req, res, user);
                });
            });

        });
    })
};

var check = function (property, value) {
    var query = {where: {}};
    query.where[property] = value;
    return global.db.User.find(query).then(function (user) {
        return user === null;
    });
};

exports.check = function (req, res) {
    if (req.query.property === undefined || req.query.value === undefined)
        return res.badRequest('You need pass property and value variables in query');
    var checkable = ['username', 'email'];
    if (checkable.indexOf(req.query.property) === -1)
        return res.badRequest('Invalid property value');

    check(req.query.property, req.query.value).then(function (available) {
        return res.ok({available: available}, 'availability signup');
    });
}

/**
 * Show the view page for login
 */
exports.loginPage = function (req, res) {
    return res.render('auth/login');
};

/**
 * User login
 */
exports.login = function (req, res) {
    passport.authenticate('local', function (err, user, message) {
        if (err)
            return res.internalServerError(err.message);

        if (!user)
            return res.badRequest(message);

        loginUser(req, res, user);
    })(req, res);
};


exports.facebook = function (req, res) {
    passport.authenticate('facebook', function (err, user, profile) {
        if (user)
            loginUser(req, res, user);

        res.cookie('profile', JSON.parse(profile._raw), {maxAge: 900000, httpOnly: true});

        return res.redirect('/auth/signup');
    })(req, res);
}

/**
 * User logout
 */
exports.logout = function (req, res) {
    req.logout();
    return res.redirect('/');
};

/**
 * Login manually after signup or when the user exists
 */
var loginUser = function (req, res, user) {
    req.login(user, function (err) {
        if (err)
            return res.internalServerError('Cannot login');

        var callback;
        if (req.query.callback !== undefined)
            callback = req.query.callback
        else
            callback = req.protocol + '://' + req.get('host');

        if (!req.xhr)
            return res.redirect(callback);

        return res.ok({
            callback: callback
        }, 'User logged');
    });
};


/**
 * Verify user email
 */
exports.verify = function (req, res) {
    var query = {where: {tokenVerifyEmail: req.params.token}};
    global.db.User.find(query).then(function (user) {
        if (!user) {
            req.flash('errorMessage', 'Token invalid');
            return res.redirect('back');
        }
        if (user.verified) {
            req.flash('successMessage', 'Email is already confirmed');
            return res.redirect('back');
        }
        user.updateAttributes({verified: true}).then(function () {
            req.flash('successMessage', 'Email confirmed');
            return res.redirect('back');
        });
    })
};

/**
 * Forgot password view
 */
exports.forgot = function (req, res) {
    return res.render('auth/forgot');
};

/**
 * Send email with link for reset password
 */
exports.forgotCreate = function (req, res) {
    var query = {where: {email: req.body.email}};
    global.db.User.find(query).then(function (user) {
        if (!user)
            return res.badRequest('Unknown user');

        if (user.provider != 'local')
            return res.badRequest('Email associated to facebook');

        user.makeTokenResetPassword().then(function () {
            var params = {
                to: user.email,
                user: user.firstname,
                url: req.protocol + '://' + req.get('host') + '/auth/reset/' + user.tokenResetPassword
            };
            global.emails.forgot(params).then(function () {
                return res.ok('Email sended for reset password');
            });
        });
    });
};

exports.reset = function (req, res) {
    var query = {where: {tokenResetPassword: req.params.token}};
    global.db.User.find(query).then(function (user) {
        if (!user) {
            req.flash('errorMessage', 'Password reset token is invalid');
            return res.redirect('back');
        }
        if (moment(user.tokenResetPasswordExpires).diff(moment()) < 0) {
            req.flash('errorMessage', 'Password reset token is expired');
            return res.redirect('back')
        }
        return res.render('auth/reset');
    });
};

exports.resetVerify = function (req, res) {
    var query = {where: {tokenResetPassword: req.params.token}};
    global.db.User.find(query).then(function (user) {
        user.salt = user.makeSalt();
        user.hashedPassword = user.encryptPassword(req.body.password, user.salt);
        user.tokenResetPassword = null;
        user.tokenResetPasswordExpires = null;
        user.save().then(function (err) {
            req.login(user, function (err) {
                req.flash('successMessage', 'Password changed');
                return res.redirect('/dashboard');
            });
        });
    });
};