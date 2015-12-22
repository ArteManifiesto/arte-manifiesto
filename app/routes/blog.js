var express = require('express');
var router = express.Router();

var controller = require(global.cf.controllers + '/blog');

var entity = 'Post';

router.get('/', controller.index);
router.post('/:page', controller.posts);

router.get('/creator', controller.creator);

router.get('/post/:nameSlugify', global.md.nameSlugify(entity), controller.postPage);

router.post('/post/create', controller.postCreate);
router.post('/post/update', global.md.entity(entity), controller.postUpdate);

module.exports = router;
