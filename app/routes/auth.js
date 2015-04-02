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
    'email',
    'user_about_me',
    'user_birthday',
    'user_friends',
    'user_interests'
];

router.post('/login', controller.login);
router.post('/signup', controller.signup);
router.get('/logout', controller.logout);

router.get('/verify/:token', controller.verify);
router.get('/success', controller.verifySuccess);
router.get('/failure', controller.verifyFailure);

router.get('/forgot', controller.forgot);
router.post('/forgot', controller.forgotCreate);

router.get('/reset/:token', controller.reset);
router.post('/reset/:token', controller.resetVerify);

router.get('/facebook', passport.authenticate('facebook', {scope: fbPermissions}));
router.get('/facebook/callback', passport.authenticate('facebook', authenticateParams));

module.exports = router;