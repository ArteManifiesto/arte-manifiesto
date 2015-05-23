var isProduction = process.env.NODE_ENV == 'production';

exports.shouldLogged = function (req, res, next) {
    if (!req.isAuthenticated()) {
        if (req.xhr)
            return res.badRequest('Necesitas iniciar sesión antes de continuar');

        req.flash('errorMessage', 'Necesitas iniciar sesión antes de continuar');
        return res.redirect('/auth/login/?returnTo=' + req.originalUrl);
    }
    next();
};

exports.isOwner = function (req, res, next) {
    if (!req.owner) {
        if (req.xhr) {
            return res.badRequest('Bad bad request guy!');
        }
    }
    next();
};

exports.shouldAdmin = function (req, res, next) {
    if (!req.isAuthenticated() || !req.user.isAdmin)
        return res.redirect('/');
    next();
};