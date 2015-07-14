var passport = require('passport');
var moment = require('moment');
var config = require('../../config/config');
var simple_recaptcha = require('simple-recaptcha-new');
var uuid = require('node-uuid');

var checkReturnTo = function (req, res) {
    var returnTo = req.query.returnTo || req.protocol + '://' + req.get('host');
    res.cookie('returnTo', returnTo, {maxAge: 900000, httpOnly: true});
};

/**
 * Show the view page for signup
 */
exports.signupPage = function (req, res) {
    checkReturnTo(req, res);
    var profile = req.cookies.profile;
    res.clearCookie('profile');
    return res.render('auth/signup', {profile: profile});
};

/**
 * User signup
 */
exports.signup = function (req, res) {
    console.log(req.body);
    check('email', req.body.email).then(function (emailAvailable) {
        var errors = [];

        if (!emailAvailable)
            errors.push({email: 'Email no esta disponible'});

        var ip = req.ip, response = req.body['g-recaptcha-response'];

        simple_recaptcha(config.recaptcha.privateKey, ip, response, function (error) {
            if (error)
                errors.push({recaptch: 'Recaptcha invalido'});

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
        return res.badRequest('Necesitas enviar una propiedad y valor');

    var checkable = ['username', 'email'];
    if (checkable.indexOf(req.query.property) === -1)
        return res.badRequest('Propiedad invalida');

    check(req.query.property, req.query.value).then(function (available) {
        return res.ok({available: available}, 'Disponibilidad de recursos');
    });
};

/**
 * Show the view page for login
 */
exports.loginPage = function (req, res) {
    checkReturnTo(req, res);
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

exports.facebookCallback = function (req, res) {
    passport.authenticate('facebook', function (err, user, profile) {
        if (user)
            return loginUser(req, res, user);

        res.cookie('profile', JSON.parse(profile._raw), {maxAge: 900000, httpOnly: true});

        return res.redirect('/auth/signup');
    })(req, res);
};

/**
 * User logout
 */
exports.logout = function (req, res) {
    req.session.destroy(function (err) {
        return res.redirect('/');
    });
};

/**
 * Login manually after signup or when the user exists
 */
var loginUser = function (req, res, user) {
    req.login(user, function (err) {
        if (err)
            return res.internalServerError('No se pudo iniciar sesion');

        var returnTo = req.cookies.returnTo || req.protocol + '://' + req.get('host');

        res.clearCookie('returnTo');

        if (!req.xhr)
            return res.redirect(returnTo);

        return res.ok({returnTo: returnTo}, 'Sesion iniciada');
    });
};


/**
 * Verify user email
 */
exports.verify = function (req, res) {
    var query = {where: {tokenVerifyEmail: req.params.token}};
    global.db.User.find(query).then(function (user) {
        if (!user) {
            req.flash('errorMessage', 'Token invalido');
            return res.redirect('back');
        }
        if (user.verified) {
            req.flash('successMessage', 'Email ya ah sido confirmado');
            return res.redirect('back');
        }
        user.updateAttributes({verified: true}).then(function () {
            req.flash('successMessage', 'Email confirmado');
            return res.redirect('back');
        });
    })
};

/**
 * Send email with link for reset password
 */
exports.forgotCreate = function (req, res) {
    var query = {where: {email: req.body.email}};
    global.db.User.find(query).then(function (user) {
        if (!user)
            return res.badRequest('No existe una cuenta para ' + req.body.email);

        user.makeTokenResetPassword().then(function () {
            var params = {
                to: user.email,
                user: user.firstname,
                url: req.protocol + '://' + req.get('host') + '/auth/reset/' + user.tokenResetPassword
            };
            global.emails.forgot(params).then(function () {
                return res.ok('Email enviado a ' + user.email);
            });
        });
    });
};

exports.reset = function (req, res) {
    var query = {where: {tokenResetPassword: req.params.token}};
    global.db.User.find(query).then(function (user) {
        if (!user) {
            req.flash('errorMessage', 'Token invalidado');
            return res.redirect('back');
        }
        if (moment(user.tokenResetPasswordExpires).diff(moment()) < 0) {
            req.flash('errorMessage', 'Token expirado');
            return res.redirect('back')
        }
        return res.render('auth/reset', {userReset: user});
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
            req.flash('successMessage', 'Contraseña actualizada');
            loginUser(req, res, user);
        });
    });
};

exports.resend = function (req, res) {
    var params = {
        to: req.user.email, user: req.user.firstname,
        url: req.protocol + '://' + req.get('host') +
        '/auth/verify/' + req.user.tokenVerifyEmail
    };

    global.emails.verify(params).then(function () {
        return res.ok(null, 'email sent');
    });
};


exports.complete = function (req, res) {

    console.log(req.body);
    var specialtiesQuery = {where: {id: {$in: req.body.specialties}}};
    var interestsQuery = {where: {id: {$in: req.body.interests}}};

    var promises = [
        global.db.Category.findAll(specialtiesQuery),
        global.db.Category.findAll(interestsQuery),
        req.user.updateAttributes(req.body)
    ];

    global.db.Sequelize.Promise.all(promises).then(function (result) {
        promises = [
            req.user.setSpecialties(result[0]),
            req.user.setInterests(result[1]),
            req.user.updateAttributes({filled: true})
        ];
        global.db.Sequelize.Promise.all(promises).then(function () {
            return res.ok(null, 'perfil completado');
        });
    });

};