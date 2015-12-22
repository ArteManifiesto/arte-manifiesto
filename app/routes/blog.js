var express = require('express');
var router = express.Router();

var controller = require(global.cf.controllers + '/blog');

router.get('/', controller.index);
router.get('/creator', controller.creator);
router.get('/post/:nameSlugify', controller.post);

module.exports = router;
