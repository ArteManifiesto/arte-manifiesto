
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
var swig = require('swig');
var compression = require('compression');
var moment = require('moment');
var minify = require('html-minifier').minify;
var paypal = require('paypal-rest-sdk');
var MongoStore = require('connect-mongo')(expressSession);

module.exports = function (app, passport) {
  /**
   * View engine setup
   * ====================================================
   */
  // if (process.env.NODE_ENV === 'production') {
  //   app.engine('html', function (pathName, locals, cb) {
  //     function cb_(err, result) {
  //       var html;
  //       if (!err) {
  //         html = minify(result, {
  //           minifyJS: true,
  //           minifyCSS: true,
  //           removeComments: true,
  //           collapseWhitespace: true
  //         });
  //       }
  //       return cb(err, html);
  //     }
  //
  //     return swig.renderFile(pathName, locals, cb_);
  //   });

  // } else {
    app.engine('html', swig.renderFile);
  // }

  app.set('views', global.cf.views);
  app.set('view engine', 'html');
  app.set('view cache', false);

  swig.setDefaults({cache: false});
  swig.setFilter('addFilter', function (url, filter) {
    if(url.indexOf('upload') > -1)
      return url.replace('upload/', 'upload/' + filter + '/');
  });

  swig.setFilter('formatDate', function (date) {
    return moment(date).fromNow();
  });

  /**
   * Setup express middlewares
   * ====================================================
   */
  app.use(compression());
  app.use(morgan('dev'));
  app.use(cookieParser('luelennuckyinleDfOfkugGEsErLQQDcS'));

  app.use(expressSession({
    secret: "2x4Zvgd93yMbP,4NQEj4[Qzjqqrq,;n#PynZMawWc",
    resave: false,
    saveUninitialized: false,
    name: 'am-session',
    cookie: {domain: '.' + global.cf.app.domain},
    store: new MongoStore({ url: 'mongodb://localhost:27017/' + process.env.DB_MONGO_NAME })
  }));

  app.use(flash());

  app.use(bodyParser.urlencoded({extended: false}));
  app.use(express.static(global.cf.public));

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
      env: process.env.NODE_ENV,
      cl_preset: process.env.CLOUDINARY_PRESET,
      successMessage: req.flash('successMessage'),
      errorMessage: req.flash('errorMessage')
    };

    if (!req.user) return next();

    var verbs = [
      'like-work', 'follow-user', 'review-work', 'request-work',
      'denied-product', 'accepted-product'
    ];

    var query = {
      where: {
        UserId: {$not: [req.user.id]},
        OwnerId: req.user.id,
        verb: {$in: [verbs]},
        seen: false
      }
    };
    global.db.Action.count(query).then(function (total) {
      res.locals.numOfNotifications = total;

    var afterGetAlert = function(alert) {
      res.locals.alert = alert;
      next();
    };

    console.log('url:', req.url, req.url.indexOf('report'));
    if(req.url.indexOf('report') !== -1)
      return next();
    
    if(req.user && !req.user.verified)
      global.db.Alert.find({where:{name: 'confirmation'}}).then(afterGetAlert);
    else
      global.db.Alert.find({where:{name: 'general', isActive: true}}).then(afterGetAlert);
    });
  });

  var mode = process.env.NODE_ENV === 'development' ? 'sandbox' : 'live';
  paypal.configure({
    'mode': mode,
    'client_id': process.env.PAYPAL_CLIENT_ID,
    'client_secret': process.env.PAYPAL_CLIENT_SECRET
  });
  app.use(global.md.check);
};
