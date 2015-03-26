var isProduction = process.env.NODE_ENV == 'production';

exports.shouldLogged = function (req, res, next) {
    if (!req.isAuthenticated())
        return res.redirect('/');
    next();
};

exports.shouldAdmin = function (req, res, next) {
    if (!req.isAuthenticated() || !req.user.isAdmin)
        return res.redirect('/');
    next();
};