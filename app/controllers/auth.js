/**
 * dependencies
 */
var passport = require('passport');
var moment = require('moment');
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
            var options = {password: req.body.password};
            delete req.body.password; // delete password because this is not saved;
            global.db.User.create(req.body, options).then(function (user) {
                //TODO send email with url for verify email
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
    req.login(user, function (err) {
        if (err) {
            return res.json({
                code: 205,
                message: 'Cannot login'
            });
        }

        return res.json({
            code: 202,
            message: 'User logged'
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
                error: "User don't exists"
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
    return res.redirect('/');
};

exports.verify = function (req, res) {
    var query = {where: {tokenVerifyEmail: req.params.token}};
    global.db.User.find(query).then(function (user) {
        if (user) {
            user.verified = true;
            user.save().then(function () {
                return res.redirect('/auth/success');
            });
        } else {
            return res.redirect('/auth/failure');
        }
    })
};

exports.verifySuccess = function (req, res) {
    return res.render('auth/success');
};

exports.verifyFailure = function (req, res) {
    return res.render('auth/failure');
};

exports.forgot = function (req, res) {
    return res.render('auth/forgot');
};

exports.forgotCreate = function (req, res) {
    var query = {where: {email: req.body.email}};
    global.db.User.find(query).then(function (user) {
        if (user) {
            if (user.provider == "local") {
                user.makeTokenResetPassword().then(function () {
                    //TODO send email with url for reset password
                    return res.json({
                        code: 202,
                        message: "Email send for reset password"
                    });
                });
            } else {
                return res.json({
                    code: 204,
                    message: "Email associated to a " + user.provider
                });
            }
        } else {
            return res.json({
                code: 203,
                message: "User don't exists"
            })
        }

    });
};


exports.reset = function (req, res) {
    var query = {
        where: {
            tokenResetPassword: req.params.token
        }
    };
    global.db.User.find(query).then(function (user) {
        if (user) {
            var tokenResetPasswordExpires = moment(user.tokenResetPasswordExpires);
            if (tokenResetPasswordExpires.diff(moment()) > 0) {
                return res.render('auth/reset');
            } else {
                req.flash('errorMessage', 'Password reset token is expired');
                return res.redirect('back');
            }
        } else {
            req.flash('errorMessage', 'Password reset token is invalid');
            return res.redirect('back');
        }
    });
};

exports.resetVerify = function (req, res) {
    var query = {
        where: {
            tokenResetPassword: req.params.token
        }
    };
    global.db.User.find(query).then(function (user) {
        if (user) {
            var tokenResetPasswordExpires = moment(user.tokenResetPasswordExpires);
            if (tokenResetPasswordExpires.diff(moment()) > 0) {
                user.salt = user.makeSalt();
                user.hashedPassword = user.encryptPassword(req.body.password, user.salt);
                user.tokenResetPassword = null;
                user.tokenResetPasswordExpires = null;
                user.save().then(function (err) {
                    req.login(user, function (err) {
                        return res.redirect('/');
                    });
                });
            } else {
                req.flash('errorMessage', 'Password reset token is expired');
                return res.redirect('back');
            }
        } else {
            req.flash('errorMessage', 'Password reset token is invalid');
            return res.redirect('back');
        }
    });
};