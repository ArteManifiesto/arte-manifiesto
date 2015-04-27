var config = require('./config');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

/**
 * Serialize Sessions
 */
passport.serializeUser(function (user, done) {
    console.log("serialized id : ", user.id);
    done(null, user.id);
});

/**
 * Deserialize user data
 */
passport.deserializeUser(function (id, done) {
    var query = {attributes: ['id', 'photo', 'firstname']};
    global.db.User.find(id).then(function (user) {
        done(null, user);
    })
});

/**
 * Authentication by Local strategy
 */
var localStrategyHandler = function (email, password, done) {
    global.db.User.find({where: {email: email}}).success(function (user) {
        if (!user)
            done(null, false, 'Unknown user');
        else if (!user.authenticate(password))
            done(null, false, 'Invalid password');
        else
            done(null, user);
    }).error(function (err) {
        done(err);
    });
};

var localStrategyData = {usernameField: 'email', passwordField: 'password'};
passport.use(new LocalStrategy(localStrategyData, localStrategyHandler));

/**
 * Authentication by Facebook strategy
 */
var fbStrategyHandler = function (accessToken, refreshToken, profile, done) {
    global.db.User.find({where: {facebookUserId: profile.id}}).then(function (user) {
        if (!user) {
            var firstname = profile.name.givenName + " " + profile.name.middleName;
            var userData = {
                email: profile.emails[0].value,
                firstname: firstname,
                lastname: profile.name.familyName,
                gender: profile.gender,
                provider: 'facebook',
                facebook: profile.profileUrl,
                facebookUserId: profile.id,
                photo: '//graph.facebook.com/' + profile.id + '/picture?type=large'
            };
            global.db.User.create(userData).then(function (user) {
                done(null, user);
            })
        } else {
            done(null, user);
        }
    })
};

var fbStrategyData = {
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.facebook.callbackURL
};

passport.use(new FacebookStrategy(fbStrategyData, fbStrategyHandler));

module.exports = passport;