var basePath = 'dashboard/';
var redirectPath = '/' + basePath;

var redirectUserConfiguration = '/user/configuration';

exports.index = function (req, res) {
    return res.render(basePath + 'index');
};