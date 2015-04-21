/**
 * Load dependencies
 * ====================================================
 */
var subdomain = require('express-subdomain');
var express = require('express');
var expressSession = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var flash = require('connect-flash');
var swig = require('swig');

/**
 * Load configuration
 * ====================================================
 */
var config = require('./config');

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

    /**
     * Passport initialize
     * ====================================================
     */
    app.use(passport.initialize());
    app.use(passport.session());


    app.use(function (req, res, next) {
        res.locals = {
            user: req.user,
            successMessage: req.flash('successMessage'),
            errorMessage: req.flash('errorMessage')
        };
        next();
    });


    var router = express.Router();

    router.get('/', function (req, res) {
        res.send('Welcome to our API!');
    });

    app.use(subdomain('api', router));
};
