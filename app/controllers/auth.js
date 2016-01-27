var passport = require('passport');
var moment = require('moment');
var simple_recaptcha = require('simple-recaptcha-new');

/**
 * Show the view page for signup
 */
exports.signupPage = function (req, res) {
  var profile = req.cookies.profile;
  res.clearCookie('profile');
  return res.render('auth/signup', {profile: profile});
};

/**
 * User signup
 */
exports.signup = function (req, res) {
  req.body.isArtist = req.body.isArtist === 'on';
  global.db.User.find({where:{email: req.body.email}}).then(function(user) {
    var errors = [];
    if(user) errors.push('Email no esta disponible');
    var ip = req.ip, response = req.body['g-recaptcha-response'];

    simple_recaptcha(global.cf.recaptcha.privateKey, ip, response, function (error) {
      if (error)
        errors.push('Recaptcha invalido');

      if (errors.length > 0)
        return res.badRequest({errors: errors}, 'Error');

      var options = {password: req.body.password};
      global.db.User.create(req.body, options).then(function (user) {
        global.emails.verify(req, {to: user}).then(function () {
          loginUser(req, res, user);
        });
      });
    });
  });
};

exports.check = function (req, res) {
  var query = {where: {id:{$not: [req.user.id]}}};
  query.where[req.body.property] = req.body.value;
  global.db.User.find(query).then(function (user) {
    var available = (user === null);
    return res.ok({available: available}, 'Disponibilidad de recursos');
  });
};

/**
 * Show the view page for login
 */
exports.loginPage = function (req, res) {
  return res.render('auth/login');
};

/**
 * Show the view page for login
 */
exports.forgotPage = function (req, res) {
  return res.render('auth/forgot');
};

/**
 * User login
 */
exports.login = function (req, res) {
  passport.authenticate('local', function (err, user, error) {
    if (!user)
      return res.badRequest({errors: [error]}, 'Error');

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
  return req.login(user, function (err) {
    if (err)
      return res.internalServerError('No se pudo iniciar sesion');

    var returnTo = req.cookies.return_to || '/';
    console.log('host : ', req.get('host'));
    console.log('return to : ', returnTo);
    console.log('return to 2w : ', req.query);

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
      return res.redirect('/');
    }

    user.updateAttributes({verified: true}).then(function () {
      req.flash('successMessage', 'Email confirmado');
      if(!req.user)
        return res.redirect('/');
      return res.redirect('/user/' + req.user.username + '/account/?context=1');
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
      return res.badRequest({errors: ['Email no encontrado']}, 'Error');
    user.makeTokenResetPassword().then(function () {
      global.emails.forgot(req, {to: user}).then(function () {
        return res.ok({email: 'Email enviado'}, 'Email enviado');
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
    return res.render('auth/reset', {token: req.params.token});
  });
};

exports.resetVerify = function (req, res) {
  if (req.body.password !== req.body.confirm_password)
    return res.badRequest({errors: ['Contraseñas no son iguales']}, 'Error');

  var query = {where: {tokenResetPassword: req.body.token}};
  global.db.User.find(query).then(function (user) {
    if(!user)
      return res.badRequest({errors: ['Token invalido']}, 'Error');

    user.salt = user.makeSalt();
    user.hashedPassword = user.encryptPassword(req.body.password, user.salt);
    user.tokenResetPassword = null;
    user.tokenResetPasswordExpires = null;
    user.save().then(function () {
      return res.ok({user: user}, 'Contraseña actualizada');
    });
  });
};

exports.resend = function (req, res) {
  global.emails.verify(req, {to: req.user}).then(function () {
    return res.ok(null, 'email sent');
  });
};
