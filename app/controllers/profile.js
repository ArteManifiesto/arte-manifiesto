exports.index = function (req, res) {
    var query;

    if (process.env.NODE_ENV == 'production')
        query = 'SELECT "id", "title", "value" FROM "Tips" AS "Tip" ORDER BY RANDOM() LIMIT 4';
    else
        query = 'SELECT `id`, `title`, `value` FROM `Tips` AS `Tip` ORDER BY RAND() LIMIT 4';

    var promises = [
        global.db.sequelize.query(query),
        req.user.getPlans(),
        req.user.getPurchases(),
        req.user.getNutritionist()
    ];

    global.db.Sequelize.Promise.all(promises).then(function (data) {
        var tips = data[0][0], plans = data[1], purchases = data[2], nutritionist = data[3];

        var lastPurchase = purchases[purchases.length - 1];

        return res.render('profile/index', {
            user: req.user,
            tips: tips,
            plans: plans,
            lastPurchase: lastPurchase,
            nutritionist: nutritionist
        });
    });
};