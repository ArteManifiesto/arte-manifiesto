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
    req.user.getCollections({include: [global.db.Work]}).then(function (collections) {
        var used = _.map(_.pluck(collections, 'Works')[0], 'id');
        used.length < 1 && (used = [0]);
        var promises = [
            global.db.Work.findAll(/*{where: {id: {not: used}}}*/),
            req.user.getLikes({attributes: ['id']})
        ];

        global.db.Sequelize.Promise.all(promises).then(function (data) {
            var works = data[0], likes = data[1];
            return res.render(basePath + 'works', {
                works: works,
                likes: likes
            });
        });
    });
};

exports.searchWork = function (req, res) {
    /*
     global.db.Action.findAndCountAll({where: {meta: {in: [1, 2]}}}).then(function (actions) {
     return res.json(actions);
     });
     */
    global.db.Category.find({
        where: {name: req.query.category},
        include: [
            {
                model: global.db.Work,
                where: {private: false}
                /*attributes: [
                 [global.db.sequelize.fn('SUM', global.db.sequelize.col('Works.id')), 'amount']
                 ],*/
            }
        ]
    }).then(function (category) {
        return res.json(category);
    });

    /*
     global.db.Work.findAll({
     order: [[global.db.Action, 'order']],
     include: [
     {
     model: global.Category,
     where: {name: req.query.name}
     }
     ]
     });*/

    /*
     var limit = 30;
     var page = req.query.page || 0;
     if (req.query.category) {
     if (req.query.page) {

     }

     }*/
};