/**
 * Load dependencies
 * ====================================================
 */
var express = require('express');
var expressSession = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var flash = require('connect-flash');
var multer = require('multer');
var swig = require('swig');

module.exports = function (app, passport) {
    /**
     * View engine setup
     * ====================================================
     */
    app.engine('html', swig.renderFile);
    app.set('views', global.cf.views);
    app.set('view engine', 'html');
    app.set('view cache', false);

    swig.setDefaults({cache: false});
    swig.setFilter('addFilter', function (url, filter) {
        return url.replace('upload/', 'upload/' + filter +'/');
    });
    /**
     * Setup express middlewares
     * ====================================================
     */
    app.use(morgan('dev'));
    app.use(cookieParser('luelennuckyinleDfOfkugGEsErLQQDcS'));
    app.use(expressSession({
        secret: '123',
        resave: false,
        saveUninitialized: false
    }));
    app.use(flash());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(express.static(global.cf.public));

    app.use(multer({
        dest: './public/uploads/',
        rename: function (fieldname, filename) {
            return Date.now()
        }
    }));
    /**
     * Passport initialize
     * ====================================================
     */
    app.use(passport.initialize());
    app.use(passport.session());

    app.use(function (req, res, next) {
        req.viewer = req.user ? req.user.id : -1;
        res.locals = {
            user: req.user,
            successMessage: req.flash('successMessage'),
            errorMessage: req.flash('errorMessage')
        };
        next();
    });

    app.use(global.md.check);
};
