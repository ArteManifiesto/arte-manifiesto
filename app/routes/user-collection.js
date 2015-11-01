var express = require('express');
var router = express.Router({mergeParams: true});

var controller = require(global.cf.controllers + "/user-collection");

var isLoggedAndOwner = [global.md.isLogged, global.md.isOwner];
var entity = 'Collection';

router.use(global.md.entity(entity));

router.get('/:nameSlugify', global.md.nameSlugify(entity), controller.index);

router.post('/all', isLoggedAndOwner, controller.all);
router.post('/create', isLoggedAndOwner, controller.create);
router.post('/update', isLoggedAndOwner, controller.update);
router.post('/delete', isLoggedAndOwner, controller.delete);

router.post('/public', isLoggedAndOwner, controller.public);
router.post('/private', isLoggedAndOwner, controller.private);

module.exports = router;
