var express = require('express');
var router = express.Router();

var controller = require(global.cf.controllers + '/tv');

var entity = 'Chapter';

router.get('/', controller.index);

router.get('/creator', global.md.isLogged, controller.creator);
router.get('/draft', global.md.isAdmin, controller.draft);

router.use('/chapter', require(global.cf.routes + '/tv-chapter'));

module.exports = router;