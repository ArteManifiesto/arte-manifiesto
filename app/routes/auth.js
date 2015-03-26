var express = require('express');
var router = express.Router();
var passport = require('passport');

var config = require('../../config/config');

var controller = require(config.controllersDir + "/auth");

var authenticateParams = {
    successRedirect: '/dashboard',
    failureRedirect: '/'
};
var fbPermissions = [
    'email', 'user_about_me'
];

router.post('/login', controller.login);
router.post('/signup', controller.signup);
router.get('/logout', controller.logout);

router.get('/facebook', passport.authenticate('facebook', {scope: fbPermissions}));
router.get('/facebook/callback', passport.authenticate('facebook', authenticateParams));

module.exports = router;