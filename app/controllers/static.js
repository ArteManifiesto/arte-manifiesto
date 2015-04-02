var basePath = 'pages/';
var redirectPath = '/';

var _ = require('lodash');

exports.index = function (req, res) {
    return res.render('index');
};

/*
 var page = parseInt(req.query.page),
 size = parseInt(req.query.size),
 skip = page > 0 ? ((page - 1) * size) : 0;
 */
exports.users = function (req, res) {
    var promises = [
        global.db.User.findAll({where: {id: {not: [req.user.id]}}, attributes: ['id', 'firstname']}),
        req.user.getFollowings({attributes: ['id']})
    ];

    global.db.Sequelize.Promise.all(promises).then(function (data) {
        var users = data[0], followings = data[1];
        return res.render(basePath + 'users', {
            users: users,
            followings: followings
        });
    });
};

exports.works = function (req, res) {
    var promises = [
        global.db.Work.findAll(),
        req.user.getLikes({attributes: ['id']})
    ];

    global.db.Sequelize.Promise.all(promises).then(function (data) {
        var works = data[0], likes = data[1];
        return res.render(basePath + 'works', {
            works: works,
            likes: likes
        });
    });
};