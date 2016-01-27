exports.isLogged = function (req, res, next) {

  console.log('is loggeed : ', req.originalUrl, req.isAuthenticated());

  if (!req.isAuthenticated()) {
    if (req.xhr)
      return res.badRequest(global.lg.isNotLogged);

    var returnTo = req.protocol + '://' + req.get('host') + req.originalUrl;
    res.cookie('return_to', returnTo, {maxAge: 3600000, domain: '.' + global.cf.app.domain});

    req.flash('errorMessage', global.lg.isNotLogged);
    return res.redirect('/auth/login');
  }
  console.log('loggeeeed');
  next();
};

exports.isOwner = function (req, res, next) {
  if (!req.owner) {
    if (req.xhr)
      return res.badRequest('Necesitas ser el propietario');

    return res.redirect('/user/' + req.params.username);
  }
  next();
};

exports.isAdmin = function (req, res, next) {
  if (!req.isAuthenticated() || !req.user.isAdmin) {
    if (req.xhr)
      return res.badRequest('Necesitas ser administrador');

    var returnTo = req.protocol + '://' + req.get('host') + req.originalUrl;
    res.cookie('return_to', returnTo, {maxAge: 3600000, domain: '.' + global.cf.app.domain});

    req.flash('errorMessage', global.lg.isNotAdmin);
    return res.redirect('http://am.local:3000/auth/login');
  }
  next();
};

exports.isAdminOrOwner = function (req, res, next) {
  if (req.owner || req.user.isAdmin)
    return next();

  if (req.xhr)
    return res.badRequest('Necesitas ser admin or owner');
  return res.redirect('/');
}

exports.user = function (req, res, next) {
  var query = {where: {}, build: true, viewer: req.viewer};
  if (req.user && req.user.username === req.params.username) {
    req.owner = true;
    query.where.id = req.user.id;
  } else {
    req.owner = false;
    query.where.username = req.params.username;
  }
  global.db.User.find(query).then(function (user) {
    if (!user) {
      if (req.xhr)
        return res.noContent('Usuario desconocido');

      req.flash('errorMessage', 'Usuario desconocido');
      return res.redirect('/');
    }
    res.locals.owner = req.owner;
    req.profile = user;
    return next();
  });
};

exports.userTo = function (req, res, next) {
  var query = {where: {id: req.body.idUser}};
  global.db.User.find(query).then(function (user) {
    if (!user) {
      return res.noContent('Usuario desconocido');
    }
    req.userTo = user;
    next();
  });
}

var entityExists = function (entity, query, req, res, next, method) {
  var temp;
  if (method) {
    temp = req.profile['get' + entity + 's'](query);
  } else {
    temp = global.db[entity].find(query);
  }
  temp.then(function (elements) {
      var element = method ? elements[0] : elements;
      if (!element) {
        if (req.xhr)
          return res.badRequest(entity + ' no existe');

        req.flash('errorMessage', entity + ' no existe');
        return res.redirect('/user/' + req.params.username);
      }

      if (entity !== 'Post') {
        if (!req.owner && !element.public) {
          res.status(401);
          return res.render('errors/401', {url: req.url});
        }

        if (entity === 'Work') {
          if (!req.user && element.nsfw) {
            res.status(401);
            return res.render('errors/nsfw');
          }
        }
      } else {
        if(!element.published) {
          if (!req.user || !req.user.isAdmin ) {
            var returnTo = req.protocol + '://' + req.get('host') + req.originalUrl;
            res.cookie('return_to', returnTo, {maxAge: 3600000, domain: '.' + global.cf.app.domain});

            req.flash('errorMessage', global.lg.isNotAdmin);
            return res.redirect('/auth/login');
          }
        }
      }
      req[entity.toLowerCase()] = element;
      next();
    }
  );
};

exports.entity = function (entity) {
  return function (req, res, next) {
    if (!req.body['id' + entity])
      return next();
    var query = {where: {id: req.body['id' + entity]}};
    entityExists(entity, query, req, res, next, false);
  }
};

exports.nameSlugify = function (entity) {
  return function (req, res, next) {
    var query = {
      where: {nameSlugify: req.params.nameSlugify},
      viewer: req.viewer, build: true, addUser: true
    };

    entityExists(entity, query, req, res, next, entity !== 'Post');
  }
};

exports.check = function (req, res, next) {
  if (!req.user || req.url.indexOf('auth') > -1) {
    return next();
  }

  if (!req.user.verified) {
    return res.render('pages/confirm-email');
  }

  if (!req.user.filled && req.method === 'GET') {
    if (req.url.indexOf('/account/?context=1') === -1) {
      return res.redirect('/user/' + req.user.username + '/account/?context=1');
    }
  }
  return next();
};
