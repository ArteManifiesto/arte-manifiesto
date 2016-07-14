var config = require('./config');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

/**
 * Serialize Sessions
 */
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

/**
 * Deserialize user data
 */
passport.deserializeUser(function (id, done) {
    global.db.User.findById(id).then(function (user) {
        done(null, user);
    })
});

/**
 * Authentication by Local strategy
 */
var localStrategyHandler = function (email, password, done) {
    global.db.User.find({where: {email: email}}).then(function (user) {
        console.log(user);
        if (!user)
            done(null, false,  'Email no encontrado');
        else if (!user.authenticate(password))
            done(null, false, 'Contraseña incorrecta');
        else
            done(null, user);
    });
};

var localStrategyData = {usernameField: 'email', passwordField: 'password'};
passport.use(new LocalStrategy(localStrategyData, localStrategyHandler));

/**
 * Authentication by Facebook strategy
 */
var fbStrategyHandler = function (accessToken, refreshToken, profile, done) {
    global.db.User.find({where: {email:profile.emails[0].value}}).then(function (user) {
        if (!user)
            done(null, false, profile);
        else
            done(null, user, profile);
    })
};

var fbStrategyData = {
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.facebook.callbackURL
};

passport.use(new FacebookStrategy(fbStrategyData, fbStrategyHandler));

module.exports = passport;
