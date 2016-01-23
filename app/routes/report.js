var express = require('express');
var router = express.Router();

var controller = require(global.cf.controllers + "/report");

router.use(global.md.isAdmin);

router.get('/', controller.index);

router.get('/users/:page', controller.users);
router.post('/users/:page', controller.search.bind(this, 'User'));

router.get('/works/:page', controller.works);
router.post('/works/:page', controller.search.bind(this, 'Work'));

router.get('/general', controller.general);

module.exports = router;
