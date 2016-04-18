var express = require('express');
var router = express.Router({
  mergeParams: true
});

var controller = require(global.cf.controllers + "/blog-post");

var entity = 'Post';

router.use(global.md.entity(entity));

router.get('/:nameSlugify', global.md.nameSlugify(entity), controller.post);
router.get('/:nameSlugify/edit', global.md.isAdmin, global.md.nameSlugify(entity), controller.edit);

router.post('/review/create', global.md.isLogged, controller.review);
router.post('/like', global.md.isLogged, controller.like);

router.post('/publish', global.md.isLogged, controller.publish);
router.post('/unpublish', global.md.isLogged, controller.unPublish);

router.post('/delete', global.md.isAdmin, controller.delete);
router.post('/featured', global.md.isAdmin, controller.featured);
router.post('/unfeatured', global.md.isAdmin, controller.unFeatured);
router.post('/create', global.md.isAdmin, controller.create);
router.post('/update', global.md.isAdmin, controller.update);


module.exports = router;