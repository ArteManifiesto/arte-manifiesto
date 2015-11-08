var isProduction = process.env.NODE_ENV == 'production';
var cloudinary = require('cloudinary').v2;
process.env.CLOUDINARY_URL = 'cloudinary://337494525976864:RQ2MXJev18AjVuf-mSNzdmu2Jsc@hackdudes'
cloudinary.config();

exports.isLogged = function (req, res, next) {
  console.log('isAuthenticated : ' , req.isAuthenticated());
    if (!req.isAuthenticated()) {
        if (req.xhr)
            return res.badRequest('Necesitas iniciar sesión antes de continuar');

        req.flash('errorMessage', 'Necesitas iniciar sesión antes de continuar');
        return res.redirect('/auth/login/?returnTo=' + req.protocol + '://' + req.get('host') + req.originalUrl);
    }
    next();
};

exports.isOwner = function (req, res, next) {
  console.log('owner : ' , req.owner);
    if (!req.owner) {
        if (req.xhr)
            return res.badRequest('Necesitas ser el propietario');

        return res.redirect('/user/' + req.params.username);
    }
    next();
};

exports.shouldAdmin = function (req, res, next) {
    if (!req.isAuthenticated() || !req.user.isAdmin)
        return res.redirect('/');
    next();
};

exports.user = function (req, res, next) {

    var excepts = ['css', 'img', 'favicon.ico'];
    console.log('paramsss ; ', req.params, req.url);

    if (req.params.username === 'img') {
        return next('route');
    }

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
        req.profile = user;
        return next();
    });
};

exports.userTo = function (req, res, next) {
    global.db.User.find({where: {id: req.body.idUser}}).then(function (user) {
        if (!user) {
            if (req.xhr)
                return res.noContent('Usuario desconocido');
            req.flash('errorMessage', 'Usuario desconocido');
            return res.redirect('/');
        }
        req.userTo = user;
        next();
    });
}


var entityExists = function (entity, query, req, res, next) {
    global.db[entity].find(query).then(function (element) {
        if (!element) {
            if (req.xhr)
                return res.badRequest(entity + ' not exists');

            req.flash('errorMessage', entity + ' not exists');
            return res.redirect('/user/' + req.params.username);
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
        entityExists(entity, query, req, res, next);
    }
};

exports.nameSlugify = function (entity) {
    return function (req, res, next) {
        var query = {
            where: {nameSlugify: req.params.nameSlugify},
            viewer: req.viewer, build: true, addUser: true
        };
        entityExists(entity, query, req, res, next);
    }
};

exports.check = function (req, res, next) {
    if (!req.user || req.url.indexOf('auth') > -1)
        return next();

    if (!req.user.verified)
        return res.render('pages/confirm-email');

    if (!req.user.filled && req.method === 'GET') {
        if(req.url.indexOf('account') === -1 )
          return res.redirect('/user/' + req.user.username + '/account');
    }

    return next();
};
