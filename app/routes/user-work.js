var express = require('express');
var router = express.Router({mergeParams: true});

var controller = require(global.cf.controllers + "/user-work");

var isLoggedAndOwner = [global.md.isLogged, global.md.isOwner];
var entity = 'Work';

router.use(global.md.entity(entity));

router.get('/add', isLoggedAndOwner, controller.add);

router.get('/:nameSlugify', global.md.nameSlugify(entity), controller.index);
router.get('/:nameSlugify/edit', isLoggedAndOwner, global.md.nameSlugify(entity), controller.edit);

router.post('/create', isLoggedAndOwner, controller.create);
router.post('/delete', isLoggedAndOwner, controller.delete);
router.post('/update', isLoggedAndOwner, controller.update);

router.post('/featured', isLoggedAndOwner, controller.featured);
router.post('/unfeatured', isLoggedAndOwner, controller.unFeatured);
router.post('/like', isLoggedAndOwner, controller.like);
router.post('/unlike', isLoggedAndOwner, controller.unLike);

router.post('/public', isLoggedAndOwner, controller.public);
router.post('/private', isLoggedAndOwner, controller.private);

module.exports = router;
