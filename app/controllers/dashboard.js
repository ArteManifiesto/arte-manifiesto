var basePath = 'dashboard/';
var redirectPath = '/' + basePath;

exports.index = function (req, res) {
    return res.render(basePath + 'index', {
        user: req.user
    });
};