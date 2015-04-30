var passport = require('passport');
var moment = require('moment');


/**
 * Show the view page for signup
 */
exports.signupPage = function (req, res) {
    return res.render('auth/signup');
};

/**
 * User signup
 */
exports.signup = function (req, res) {
    req.body.photo = "http://res.cloudinary.com/arte-manifiesto/image/upload/v1430416332/profile_hrnftg.jpg";
    var query = {where: {email: req.body.email}};
    global.db.User.find(query).then(function (user) {
        if (user)
            return res.conflict('User exists');

        var options = {password: req.body.password};
        delete req.body.password;
        global.db.User.create(req.body, options).then(function (user) {
            var params = {
                to: user.email,
                user: user.firstname,
                url: req.protocol + '://' + req.get('host') + '/auth/verify/' + user.tokenVerifyEmail
            };
            global.emails.verify(params).then(function () {
                loginUser(req, res, user);
            });
        });
    });
};

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

        return res.ok('User logged');
    });
};

/**
 * Verify view success
 */
exports.verifySuccess = function (req, res) {
    return res.render('auth/success');
};

/**
 * Verify view failure
 */
exports.verifyFailure = function (req, res) {
    return res.render('auth/failure');
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