exports.specific = function (req, res) {
    global.db.SpecificData.create(req.body).then(function (specificData) {
        specificData.setUser(req.user).then(function () {
            return res.json(specificData);
        });
    });
};