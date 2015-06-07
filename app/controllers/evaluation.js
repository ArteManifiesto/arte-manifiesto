var db = require('../../config/sequelize');

exports.index = function (req, res) {
    if (req.isAuthenticated()) {
        if (req.user.email) {
            req.user.getEvaluation().then(function (evaluation) {
                if (evaluation)
                    return res.redirect('/evaluation/result');
                else
                    return res.render('evaluation/index', {user: req.user});
            })
        } else {
            return res.redirect('/auth/confirm');
        }
    } else {
        return res.render('evaluation/index');
    }
};

exports.create = function (req, res) {
    db.Evaluation.create({data: req.body.evaluationData}).then(function (evaluation) {
        req.user.setEvaluation(evaluation).then(function () {
            evaluation.validate(function () {
                return res.redirect('/evaluation/result');
            });
        });
    })
};

exports.result = function (req, res) {
    res.clearCookie('evaluationData', {path: '/'});
    req.user.getEvaluation().then(function (evaluation) {
        req.user.getPurchases().then(function (purchases) {
            if (purchases.length > 0) {
                return res.redirect('/dashboard');
            } else {
                return res.render('evaluation/result', {
                    user: req.user,
                    evaluation: evaluation
                });
            }
        });
    });
};

exports.retake = function (req, res) {
    req.user.getEvaluation().then(function (evaluation) {
        evaluation.destroy().then(function () {
            return res.redirect('/evaluation');
        });
    });
};
