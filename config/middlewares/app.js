var isProduction = process.env.NODE_ENV == 'production';

exports.shouldLogged = function (req, res, next) {
    if (!req.isAuthenticated()) {
        if (req.xhr)
            return res.badRequest('You need to sign in or join before continuing.');
        req.flash('errorMessage', 'You need to sign in or join before continuing.');
        return res.redirect('/auth/login');
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