var basePath = 'user/';
var redirectPath = '/' + basePath;
var Chance = require('chance');
var _ = require('lodash');
var chance = new Chance();

exports.profile = function (req, res) {
    var showProfile = function (user, owner) {
        var promises = [
            user.getFollowings(),
            user.getFollowers(),
            user.getCollections({include: [{model: global.db.Work, include: [global.db.Category, global.db.Tag]}]}),
            user.getLikes()
        ];
        global.db.Sequelize.Promise.all(promises).then(function (data) {
            var followings = data[0], followers = data[1], collections = data[2], likes = data[3];

            var view = owner ? 'owner' : 'profile';

            var dataToView = {
                followings: followings,
                followers: followers,
                collections: collections,
                likes: likes
            };
            if (!owner)
                dataToView.userProfile = user;
            return res.render(basePath + view, dataToView);
        });
    };

    if (req.user.username == req.params.username) {
        showProfile(req.user, true);
    } else {
        global.db.User.find({where: {username: req.params.username}}).then(function (user) {
            if (user) {
                showProfile(user, false);
            } else {
                return res.redirect('back');
            }
        });
    }
};


exports.update = function (req, res) {
    var specialtiesData = JSON.parse(req.body.specialties);
    var interestsData = JSON.parse(req.body.interests);

    delete req.body.specialties;
    delete req.body.interests;

    var promises = [
        global.db.Category.findAll({where: {id: {in: specialtiesData}}}),
        global.db.Category.findAll({where: {id: {in: interestsData}}})
    ];

    global.db.Sequelize.Promise.all(promises).then(function (result) {
        var specialties = result[0], interests = result[1];
        promises = [
            req.user.updateAttributes(req.body),
            req.user.setSpecialties(specialties),
            req.user.setInterests(interests)
        ];

        global.db.Sequelize.Promise.all(promises).then(function () {
            return res.json({
                code: 203,
                message: 'User updated'
            });
        });
    });
};

exports.configuration = function (req, res) {
    var promises = [
        global.db.Category.findAll(),
        req.user.getSpecialties(),
        req.user.getInterests()
    ];

    global.db.Sequelize.Promise.all(promises).then(function (data) {
        var categories = data[0], specialties = data[1], interests = data[2];

        return res.render(basePath + 'configuration', {
            categories: categories,
            specialties: specialties,
            interests: interests
        });
    });
};

exports.follow = function (req, res) {
    console.log("follow id : ", req.params.idUser);
    global.db.User.find(req.params.idUser).then(function (user) {
        req.user.addFollowing(user).then(function () {
            return res.json({
                code: 202,
                message: 'follow to ' + user.firstname
            });
        });
    })
};

exports.unfollow = function (req, res) {
    console.log("unfollow id : ", req.params.idUser);
    global.db.User.find(req.params.idUser).then(function (user) {
        req.user.removeFollowing(user).then(function () {
            return res.json({
                code: 202,
                message: 'unfollow to ' + user.firstname
            });
        });
    })
};

exports.upload = function (req, res) {
    return res.render(basePath + 'upload');
};

exports.postUpload = function (req, res) {
    var promises = [global.db.Category.findAll()];
    if (req.body.idCollection)
        promises.push(global.db.Collection.find(req.body.idCollection));
    else
        promises.push(global.db.Collection.find(1));

    var workPayload = {
        name: chance.name(),
        photo: 'http://i.imgur.com/QPACTzF.png',
        private: _.sample([0, 1])
    };
    promises.push(global.db.Work.create(workPayload));

    promises.push(global.db.Tag.findAll());

    global.db.Sequelize.Promise.all(promises).then(function (data) {
        var categories = _.sample(_.shuffle(data[0]), _.random(1, 3));
        var collection = data[1];
        var work = data[2];
        var tags = _.sample(_.shuffle(data[3]), _.random(1, 3));

        promises = [
            collection.addWork(work),
            work.addCategories(categories),
            work.setTags(tags)
        ];

        global.db.Sequelize.Promise.all(promises).then(function () {
            return res.redirect('/user/' + req.user.username);
        });
    });
};


exports.like = function (req, res) {
    console.log("like id : ", req.params.idWork);

    global.db.Work.find(req.params.idWork).then(function (work) {
        req.user.addLike(work).then(function () {
            return res.json({
                code: 202,
                message: 'like to ' + work.name
            });
        });
    })
};

exports.unlike = function (req, res) {
    console.log("unlike id : ", req.params.idWork);
    global.db.Work.find(req.params.idWork).then(function (work) {
        req.user.removeLike(work).then(function () {
            return res.json({
                code: 202,
                message: 'unlike to ' + work.name
            });
        });
    })
};