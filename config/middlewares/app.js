var isProduction = process.env.NODE_ENV == 'production';

exports.shouldLogged = function (req, res, next) {
    if (!req.isAuthenticated()) {
        req.flash('errorMessage', 'You need to sign in or join before continuing.');
        return res.redirect('/auth/login');
    }
    next();
};

exports.shouldAdmin = function (req, res, next) {
    if (!req.isAuthenticated() || !req.user.isAdmin)
        return res.redirect('/');
    next();
};