var express = require('express');
var router = express.Router();

var controller = require(global.cf.controllers + '/blog');

var entity = 'Post';


router.get('/', controller.index);

router.get('/category/:category', controller.categoryPosts);

router.post('/:page', controller.posts);

router.get('/creator', global.md.isAdmin, controller.creator);

router.get('/post/:nameSlugify', global.md.nameSlugify(entity), controller.postPage);
router.get('/post/:nameSlugify/edit',global.md.isAdmin, global.md.nameSlugify(entity), controller.editPage);

router.post('/post/review/create', global.md.isLogged,  controller.createReview);

router.post('/post/like', global.md.isLogged, global.md.entity(entity), controller.like);

router.post('/post/create', global.md.isAdmin, controller.postCreate);
router.post('/post/update', global.md.isAdmin, global.md.entity(entity), controller.postUpdate);

module.exports = router;
