var express = require('express');
var router = express.Router();

var controller = require(global.cf.controllers + '/blog');

var entity = 'Post';


router.get('/', controller.index);

router.get('/category/:category', controller.categoryPosts);

router.post('/:page', controller.posts);

router.get('/creator', global.md.isAdmin, controller.creator);

router.use('/post', require(global.cf.routes + "/blog-post"));

module.exports = router;
