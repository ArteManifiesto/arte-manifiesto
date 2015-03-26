var moment = require('moment');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('./../../config/config');
var db = require('./../../config/sequelize');

var checkUserPlan = function () {
    var promises = [];
    db.Plan.findAll({where: {isActive: true}}).then(function (plans) {
        var i, plan;
        for (i = 0; i < plans.length; i++) {
            plan = plans[i];
            if (moment(plan.endAt).diff(moment(), 'days') <= 0) {
                plan.isActive = false;
                promises.push(plan.save())
            }
        }
        db.Sequelize.Promise.all(promises).then(function () {
            process.exit();
        })
    });
};

checkUserPlan();