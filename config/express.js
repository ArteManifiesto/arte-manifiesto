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

/**
 * Load configuration
 * ====================================================
 */
var config = require('./config');
var middlewares = require(config.middlewaresDir + "/app");

module.exports = function (app, passport) {
    /**
     * View engine setup
     * ====================================================
     */
    app.engine('html', swig.renderFile);
    app.set('views', config.viewsDir);
    app.set('view engine', 'html');
    app.set('view cache', false);

    swig.setDefaults({cache: false});

    /**
     * Setup express middlewares
     * ====================================================
     */
    app.use(morgan('dev'));
    app.use(cookieParser('luelennuckyinleDfOfkugGEsErLQQDcS'));
    app.use(expressSession({secret: 'o/g8Ffy=]Nw(J624m7)c2;)/;EJy^6448', resave: false, saveUninitialized: false}));
    app.use(flash());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(express.static(config.publicDir));

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

    app.use(middlewares.checkEmail);
    //app.use(middlewares.checkFillData);

    app.use(function (req, res, next) {
        req.viewer = req.user ? req.user.id : -1;
        res.locals = {
            user: req.user,
            successMessage: req.flash('successMessage'),
            errorMessage: req.flash('errorMessage'),
            emailMessage: req.flash('emailMessage')
        };
        next();
    });
};
