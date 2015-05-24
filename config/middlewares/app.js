var isProduction = process.env.NODE_ENV == 'production';

exports.isLogged = function (req, res, next) {
    if (!req.isAuthenticated()) {
        if (req.xhr)
            return res.badRequest('Necesitas iniciar sesión antes de continuar');

        req.flash('errorMessage', 'Necesitas iniciar sesión antes de continuar');
        return res.redirect('/auth/login/?returnTo=' + req.protocol + '://' + req.get('host') + req.originalUrl);
    }
    next();
};

exports.isOwner = function (req, res, next) {
    if (!req.owner) {
        if (req.xhr)
            return res.badRequest('Necesitas ser el propietario');

        return res.redirect('/' + req.params.username);
    }
    next();
};

exports.shouldAdmin = function (req, res, next) {
    if (!req.isAuthenticated() || !req.user.isAdmin)
        return res.redirect('/');
    next();
};

exports.user = function (req, res, next) {
    console.log('usernameeeee =====> ', req.params.username);
    if (req.user && req.user.username == req.params.username) {
        req.profile = req.user;
        req.viewer = req.user.id;
        req.owner = true;
        return next();
    }
    var query = {where: {username: req.params.username}};
    global.db.User.find(query).then(function (user) {
        if (!user)
            if (req.xhr) {
                return res.noContent('User dont exists');
            }
            else {
                req.flash('errorMessage', 'User dont exists');
                return res.redirect('/');
            }
        req.profile = user;
        req.viewer = req.user ? req.user.id : 0;
        req.owner = false;
        return next();
    });
};

var entityExists = function (entity, query, req, res, next) {
    global.db[entity].find(query).then(function (element) {
        if (!element) {
            if (req.xhr)
                return res.badRequest(entity + ' not exists');

            req.flash('errorMessage', entity + ' not exists');
            return res.redirect('/' + req.params.username);
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
        var query = {where: {nameSlugify: req.params.nameSlugify}};
        entityExists(entity, query, req, res, next);
    }
};