var basePath = 'user/account/';

exports.index = function (req, res) {
    var promises = [
        global.db.Category.findAll(),
        req.user.getSpecialties(),
        req.user.getInterests()
    ];
    global.db.Sequelize.Promise.all(promises).then(function (data) {
        return res.render(basePath + 'index', {
            categories: data[0],
            specialties: data[1],
            interests: data[2]
        });
    });
};
//TODO make possible that the user can have multiple photos
exports.photo = function (req, res) {

};

exports.addresses = function (req, res) {
    req.user.getAddresses().then(function (addresses) {
        return res.render(basePath + 'addresses');
    });
};

exports.websites = function (req, res) {

};

exports.password = function (req, res) {

};

exports.update = function (req, res) {
    var specialtiesData = JSON.parse(req.body.specialties);
    var interestsData = JSON.parse(req.body.interests);

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