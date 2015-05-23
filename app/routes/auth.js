var express = require('express');
var router = express.Router();
var passport = require('passport');

var config = require('../../config/config');

var controller = require(config.controllersDir + "/auth");

router.get('/login', controller.loginPage);
router.get('/signup', controller.signupPage);
router.get('/logout', controller.logout);

router.post('/login', controller.login);
router.post('/signup', controller.signup);
router.post('/check', controller.check);

router.get('/verify/:token', controller.verify);

router.get('/forgot', controller.forgot);
router.post('/forgot', controller.forgotCreate);

router.get('/reset/:token', controller.reset);
router.post('/reset/:token', controller.resetVerify);

var permissions = ['email', 'user_about_me', 'user_birthday', 'user_friends', 'user_website'];

router.get('/facebook', passport.authenticate('facebook', {scope: permissions}));
router.get('/facebook/callback', controller.facebookCallback);

module.exports = router;