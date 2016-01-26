var express = require('express');
var router = express.Router({mergeParams: true});

var controller = require(global.cf.controllers + "/blog-post");

var entity = 'Post';

router.use(global.md.entity(entity));

router.get('/:nameSlugify', global.md.nameSlugify(entity), controller.postPage);
router.get('/:nameSlugify/edit',global.md.isAdmin, global.md.nameSlugify(entity), controller.editPage);

router.post('/review/create', global.md.isLogged,  controller.createReview);
router.post('/like', global.md.isLogged, controller.like);

router.post('/featured', global.md.isAdmin, controller.featured);
router.post('/unfeatured', global.md.isAdmin, controller.unFeatured);
router.post('/create', global.md.isAdmin, controller.postCreate);
router.post('/update', global.md.isAdmin, controller.postUpdate);


module.exports = router;
