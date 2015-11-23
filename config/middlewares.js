exports.isLogged = function (req, res, next) {
    if (!req.isAuthenticated()) {
        if (req.xhr)
            return res.badRequest(global.lg.isNotLogged);

        req.flash('errorMessage', global.lg.isNotLogged);
        var url = '/auth/login/?returnTo=' + req.protocol + '://' + req.get('host') + req.originalUrl;
        return res.redirect(url);
    }
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
          return res.badRequest('Necesitas ser admin');
      return res.redirect('/');
    }
    next();
};

exports.isAdminOrOwner = function(req,res, next) {
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
  query.all = true;
  if(method) {
    temp = req.profile['get' + entity + 's'](query);
  }else {
    temp = global.db[entity].find(query);
  }
  temp.then(function(elements) {
    var element = method ? elements[0] : elements;
    if (!element) {
        if (req.xhr)
            return res.badRequest(entity + ' not exists');

        req.flash('errorMessage', entity + ' not exists');
        return res.redirect('/user/' + req.params.username);
    }

    if(!req.owner && !element.public) {
      res.status(401);
      return res.render('errors/401', {url: req.url});
    }

    req[entity.toLowerCase()] = element;
    next();
  });
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
        entityExists(entity, query, req, res, next , true);
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
        if(req.url.indexOf('/account/?context=1') === -1) {
          return res.redirect('/user/' + req.user.username + '/account/?context=1');
        }
    }
    return next();
};
