var express = require('express');
var router = express.Router();

var controller = require(global.cf.controllers + "/report");

router.get('/', controller.index);

router.get('/users/:page', controller.users);
router.post('/users/:page', controller.search.bind(this, 'User'));

router.get('/works/:page', controller.works);
router.post('/works/:page', controller.search.bind(this, 'Work'));

router.get('/blog/:page', controller.blog);
router.post('/blog/:page', controller.search.bind(this, 'Post'));

router.get('/banners/edit/:idBanner', controller.editBanner);
router.post('/banners/update', controller.updateBanner);

router.get('/general', controller.general);
router.get('/banners', controller.banners);

module.exports = router;
