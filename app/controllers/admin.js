var config = require('../../config/config');
var email = require('./email');
var xls = require("xls-to-json");
var _ = require('lodash');

var crudByExcel = function (model, result, callback) {
    var promises = [];
    global.db[model].findAll().then(function (items) {
        checkUpdateAndCreate(global.db[model], result, items, callback);
    });

    var getItemByResult = function (result, id) {
        for (var i = 0; i < result.length; i++)
            if (result[i].id == id)return result[i];
    };

    var checkUpdateAndCreate = function (model, result, data, callback) {
        var promises = [];
        var i, idData = [], idResult = [];
        for (i = 0; i < data.length; i++) {
            idData.push(data[i].id);
            promises.push(model["update"](getItemByResult(result, data[i].id), {where: {id: data[i].id}}));
        }

        for (i = 0; i < result.length; i++)
            idResult.push(parseInt(result[i].id, 10));

        var createIds = _.difference(idResult, idData);
        for (i = 0; i < createIds.length; i++) {
            promises.push(model["create"](getItemByResult(result, createIds[i])));
        }

        global.db.Sequelize.Promise.all(promises).then(function () {
            callback();
        });
    };
};


exports.index = function (req, res) {
    global.db.User.findAll({where: {isAdmin: true}}).then(function (admins) {
        return res.render('admin/index', {
            admins: admins
        });
    });
};

exports.addAdmin = function (req, res) {
    global.db.User.find(req.params.idUser).then(function (user) {
        user.isAdmin = true;
        user.save().then(function () {
            return res.redirect('/admin/users');
        });
    });
};
exports.removeAdmin = function (req, res) {
    global.db.User.find(req.params.idUser).then(function (user) {
        user.isAdmin = false;
        user.save().then(function () {
            return res.redirect('/admin');
        });
    });
};

exports.users = function (req, res) {
    global.db.User.findAll({
        include: [global.db.Purchase, global.db.Evaluation],
        order: '"id" ASC'
    }).then(function (users) {
        return res.render('admin/users', {
            users: users
        });
    });
};

exports.userActivate = function (req, res) {
    var idUser = req.params.idUser;
    var idPlan = req.params.idPlan;

    global.db.User.find(idUser).then(function (user) {
        var lastPurchase, isTrial = false;
        user.getPurchases().then(function (purchases) {
            if (process.env.NODE_ENV == 'production')
                lastPurchase = purchases[0];
            else
                lastPurchase = purchases[purchases.length - 1];

            isTrial = lastPurchase && lastPurchase.type == 0;

            global.db.Purchase.create({
                type: idPlan
            }).then(function (purchase) {
                var sendEmailHandler = function () {
                    var locals = {
                        from: 'Zanna Activación <admin@zanna.com>',
                        to: user.email,
                        subject: 'Su Plan a sido activada!'
                    };
                    email.send(locals, 'activate', function () {
                        return res.redirect('/admin/users');
                    });
                };

                var afterResult = function () {
                    if (isTrial) {
                        lastPurchase.isActive = false;
                        lastPurchase.save().then(sendEmailHandler);
                    } else {
                        sendEmailHandler();
                    }
                };

                user.addPurchase(purchase).then(function () {
                    user.getNutritionist().then(function (nutritionist) {
                        if (nutritionist) {
                            if (purchase.type < 4)
                                user.setNutritionist(null).then(afterResult);
                            else
                                afterResult();
                        } else {
                            if (purchase.type > 3) {
                                global.db.Nutritionist.findAll().then(function (nutritionists) {
                                    nutritionists = _.shuffle(nutritionists);
                                    user.setNutritionist(_.sample(nutritionists)).then(afterResult);
                                });
                            } else {
                                afterResult();
                            }
                        }
                    });
                });
            });
        });
    });
};
exports.userDesactivate = function (req, res) {
    global.db.User.find(req.params.idUser).then(function (user) {
        user.getPurchases().then(function (purchases) {
            var lastPurchase;
            var afterResult = function () {
                lastPurchase.destroy().then(function () {
                    return res.redirect('/admin/users');
                });
            };
            if (process.env.NODE_ENV == 'production')
                lastPurchase = purchases[0];
            else
                lastPurchase = purchases[purchases.length - 1];

            if (lastPurchase.type > 3)
                user.setNutritionist(null).then(afterResult);
            else
                afterResult()
        });
    });
};

exports.meals = function (req, res) {
    global.db.Meal.findAll({
        order: '"id" ASC'
    }).then(function (meals) {
        return res.render('admin/meals', {
            meals: meals
        });
    });
};

exports.mealCreate = function (req, res) {
    xls({
        input: config.root + '/' + req.files.file.path,
        output: null,
        sheet: ""
    }, function (err, result) {
        crudByExcel('Meal', result, function () {
            return res.redirect('/admin/meals');
        });
    });
};

exports.ingredients = function (req, res) {
    global.db.Ingredient.findAll({
        order: '"id" ASC'
    }).then(function (ingredients) {
        return res.render('admin/ingredients', {
            ingredients: ingredients
        });
    });
};

exports.ingredientCreate = function (req, res) {
    xls({
        input: config.root + '/' + req.files.file.path,
        output: null,
        sheet: ""
    }, function (err, result) {
        global.db.Ingredient.findAll().then(function (ingredients) {
            var i, ingredient, total = ingredients.length, promises = [];
            for (i = 0; i < total; i++) {
                ingredient = ingredients[i];
                promises.push(ingredient.destroy());
            }
            global.db.Sequelize.Promise.all(promises).then(function () {
                global.db.Ingredient.bulkCreate(result).then(function () {
                    return res.redirect('/admin/ingredients');
                });
            });
        });
    });
};


exports.tips = function (req, res) {
    global.db.Tip.findAll({
        order: '"id" ASC'
    }).then(function (tips) {
        return res.render('admin/tips', {
            tips: tips
        });
    })
};
exports.tipCreate = function (req, res) {
    global.db.Tip.create(req.body).then(function (tip) {
        return res.redirect('/admin/tips');
    })
};
exports.tipDelete = function (req, res) {
    global.db.Tip.find(req.params.idTip).then(function (tip) {
        tip.destroy().then(function () {
            return res.redirect('/admin/tips');
        });
    })
};

exports.nutritionists = function (req, res) {
    global.db.Nutritionist.findAll({
        order: '"id" ASC'
    }).then(function (nutritionists) {
        return res.render('admin/nutritionists', {
            nutritionists: nutritionists
        });
    })
};

exports.nutritionistCreate = function (req, res) {
    global.db.Nutritionist.create(req.body).then(function (nutritionist) {
        return res.redirect('/admin/nutritionists');
    })
};

exports.nutritionistDelete = function (req, res) {
    global.db.Nutritionist.find(req.params.idNutritionist).then(function (nutritionist) {
        var destroyNutritionist = function (callback) {
            nutritionist.destroy().then(callback);
        };
        nutritionist.getUsers().then(function (users) {
            var promises = [];
            if (users.length > 0) {
                var i;
                for (i = 0; i < users.length; i++) {
                    promises.push(users[i].setNutritionist(null));
                }
                global.db.Sequelize.Promise.all(promises).then(function () {
                    destroyNutritionist(function () {
                        global.db.Nutritionist.findAll().then(function (nutritionists) {
                            nutritionists = _.shuffle(nutritionists);
                            i = 0;
                            promises = [];
                            for (i; i < users.length; i++) {
                                promises.push(users[i].setNutritionist(_.sample(nutritionists)));
                            }
                            global.db.Sequelize.Promise.all(promises).then(function () {
                                return res.redirect('/admin/nutritionists');
                            });
                        });
                    });
                });
            } else {
                destroyNutritionist(function () {
                    return res.redirect('/admin/nutritionists');
                });
            }
        });
    })
};


exports.subscribers = function (req, res) {
    global.db.Subscriber.findAll({
        order: '"id" ASC'
    }).then(function (subscribers) {
        return res.render('admin/subscribers', {
            subscribers: subscribers
        });
    })
};