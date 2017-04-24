var simple_recaptcha = require('simple-recaptcha-new');
var passport = require('passport');
var moment = require('moment');

/**
 * Show the view page for signup
 */
exports.signupPage = function(req, res) {
  var profile = req.cookies.profile;
  res.clearCookie('profile');
  return res.render('auth/signup', {
    profile: profile
  });
};

/**
 * User signup
 */
exports.signup = function(req, res) {
  console.log(req.body);
  req.body.isArtist = false;
  global.db.User.find({
    where: {
      email: req.body.email
    }
  }).then(function(user) {
    var errors = [];
    if (user) errors.push('Email no esta disponible');
    var ip = req.ip,
      response = req.body['g-recaptcha-response'];

    simple_recaptcha(global.cf.recaptcha.privateKey, ip, response, function(error) {
      console.log(error);
      if (error)
        errors.push('Recaptcha invalido');

      if (errors.length > 0)
        return res.badRequest({
          errors: errors
        }, 'Error');

      var options = {
        password: req.body.password
      };

      if (req.body.photo) req.body.verified = true;
      global.db.User.create(req.body, options).then(function(user) {
        global.emails.verify(req, {
          to: user
        }).then(function() {
          loginUser(req, res, user);
        });
      });
    });
  });
};

exports.check = function(req, res) {
  var query = {
    where: {
      id: {
        $not: [req.user.id]
      }
    }
  };
  query.where[req.body.property] = req.body.value;
  global.db.User.find(query).then(function(user) {
    var available = (user === null);
    return res.ok({
      available: available
    }, 'Disponibilidad de recursos');
  });
};

/**
 * Show the view page for login
 */
exports.loginPage = function(req, res) {
  return res.render('auth/login');
};

/**
 * Show the view page for login
 */
exports.forgotPage = function(req, res) {
  return res.render('auth/forgot');
};

/**
 * User login
 */
exports.login = function(req, res) {
  console.log(req.body);
  passport.authenticate('local', function(err, user, error) {
    console.log(user);
    if (!user)
      return res.badRequest({
        errors: [error]
      }, 'Error');

    loginUser(req, res, user);
  })(req, res);
};

exports.facebookCallback = function(req, res) {
  passport.authenticate('facebook', function(err, user, profile) {
    if (user)
      return loginUser(req, res, user);

    var profile = JSON.parse(profile._raw);
    var options = {};
    options.email = profile.email;
    if (profile.first_name) options.firstname = profile.first_name;
    if (profile.middle_name) options.firstname += ' ' + profile.middle_name;
    if (profile.last_name) options.lastname = ' ' + profile.last_name;
    if (profile.gender) options.gender = (profile.gender === 'male' ? 'Masculino' : 'Femenino');
    if (profile.photo) 'http://res.cloudinary.com/hackdudes/image/facebook/w_150,h_150,q_70/' + options.id + '.jpg';
    if (profile.birthday) options.birthday = profile.birthday;
    if (profile.bio) options.biography = profile.bio;
    options.verified = true;
    global.db.User.create(options).then(function(user) {
      loginUser(req, null, user, function() {
        var returnTo = req.cookies.return_to || '/';
        if(returnTo.indexOf('featured') > -1)
          returnTo = '/';
        return res.redirect(returnTo);
      });
    });
  })(req, res);
};

/**
 * User logout
 */
exports.logout = function(req, res) {
  req.session.destroy(function(err) {
    return res.redirect('/');
  });
};

/**
 * Login manually after signup or when the user exists
 */
var loginUser = function(req, res, user, callback) {
  return req.login(user, function(err) {
    if (res && err)
      return res.internalServerError('No se pudo iniciar sesion');

    var returnTo = req.cookies.return_to || '/';

    if (returnTo.indexOf('featured') > -1)
      returnTo = '/';

    if (res) {
      res.cookie('return_to', returnTo, {
        maxAge: 3600000,
        domain: '.' + global.cf.app.domain
      });

      if (!req.xhr)
        return res.redirect(returnTo);

      return res.ok({
        returnTo: returnTo
      }, 'Sesion iniciada');
    } else {
      callback();
    }
  });
};


/**
 * Verify user email
 */
exports.verify = function(req, res) {
  var query = {
    where: {
      tokenVerifyEmail: req.params.token
    }
  };
  global.db.User.find(query).then(function(user) {
    if (!user) {
      req.flash('errorMessage', 'Token invalido');
      return res.redirect('back');
    }

    if (user.verified) {
      req.flash('successMessage', 'Email ya ah sido confirmado');
      return res.redirect('/');
    }

    user.updateAttributes({
      verified: true
    }).then(function() {
      req.flash('successMessage', 'Email confirmado');
      if (!req.user)
        return res.redirect('/');
      return res.redirect('/user/' + req.user.username + '/account/?context=1');
    });
  })
};

/**
 * Send email with link for reset password
 */
exports.forgotCreate = function(req, res) {
  var query = {
    where: {
      email: req.body.email
    }
  };
  global.db.User.find(query).then(function(user) {
    if (!user)
      return res.badRequest({
        errors: ['Email no encontrado']
      }, 'Error');
    user.makeTokenResetPassword().then(function() {
      global.emails.forgot(req, {
        to: user
      }).then(function() {
        return res.ok({
          email: 'Email enviado'
        }, 'Email enviado');
      });
    });
  });
};

/**
 * Well this method decide whether a token is valid and shows the page
 * where the user will change their password or it just make you cry
 */
exports.reset = function(req, res) {
  var query = {
    where: {
      tokenResetPassword: req.params.token
    }
  };
  global.db.User.find(query).then(function(user) {
    if (!user) {
      req.flash('errorMessage', 'Token invalidado');
      return res.redirect('back');
    }
    if (moment(user.tokenResetPasswordExpires).diff(moment()) < 0) {
      req.flash('errorMessage', 'Token expirado');
      return res.redirect('back')
    }
    return res.render('auth/reset', {
      token: req.params.token
    });
  });
};

/**
 * verify is the token is still valid and if the password and confirm_password
 * are the same
 */
exports.resetVerify = function(req, res) {
  if (req.body.password !== req.body.confirm_password)
    return res.badRequest({
      errors: ['Contraseñas no son iguales']
    }, 'Error');

  var query = {
    where: {
      tokenResetPassword: req.body.token
    }
  };
  global.db.User.find(query).then(function(user) {
    if (!user)
      return res.badRequest({
        errors: ['Token invalido']
      }, 'Error');

    user.salt = user.makeSalt();
    user.hashedPassword = user.encryptPassword(req.body.password, user.salt);
    user.tokenResetPassword = null;
    user.tokenResetPasswordExpires = null;
    user.save().then(function() {
      return res.ok({
        user: user
      }, 'Contraseña actualizada');
    });
  });
};

/**
 * resend email to confirm the damn user's email
 */
exports.resend = function(req, res) {
  global.emails.verify(req, {
    to: req.user
  }).then(function() {
    return res.ok(null, 'email sent');
  });
};