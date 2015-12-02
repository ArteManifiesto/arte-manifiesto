var express = require('express');
var router = express.Router();
var passport = require('passport');

var controller = require(global.cf.controllers + "/auth");

var fbOptions = {scope: global.fbPermissions};

router.get('/login', controller.loginPage);
router.get('/signup', controller.signupPage);
router.get('/forgot', controller.forgotPage);
router.get('/logout', controller.logout);

router.get('/verify/:token', controller.verify);
router.get('/reset/:token', controller.reset);

router.get('/facebook', passport.authenticate('facebook', fbOptions));
router.get('/facebook/callback', controller.facebookCallback);

router.post('/login', controller.login);
router.post('/signup', controller.signup);
router.post('/check', controller.check);

router.post('/resend', global.md.isLogged, controller.resend);

router.post('/forgot', controller.forgotCreate);
router.post('/reset/', controller.resetVerify);


module.exports = router;
