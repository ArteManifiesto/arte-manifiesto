var express = require('express');
var router = express.Router({mergeParams: true});

var controller = require(global.cf.controllers + '/user-work');

var isLoggedAndOwner = [global.md.isLogged, global.md.isOwner];
var isLoggedAdminOrOwner = [global.md.isLogged, global.md.doubleAccess];
var entity = 'Work';

router.use(global.md.entity(entity));

router.get('/add', isLoggedAndOwner, controller.add);

router.get('/:nameSlugify', global.md.nameSlugify(entity), controller.index.bind(this, 'index'));
router.get('/:nameSlugify/reviews', global.md.nameSlugify(entity), controller.index.bind(this, 'reviews'));
router.get('/:nameSlugify/tags', global.md.nameSlugify(entity), controller.index.bind(this, 'tags'));
// router.get('/:nameSlugify/products', global.md.nameSlugify(entity), controller.index.bind(this, 'products'));

router.get('/:nameSlugify/edit', isLoggedAdminOrOwner, global.md.nameSlugify(entity), controller.edit);
router.get('/:nameSlugify/published', isLoggedAdminOrOwner, global.md.nameSlugify(entity), controller.published);

// router.get('/:nameSlugify/edit', isLoggedAndOwner, global.md.nameSlugify(entity), controller.edit);
// router.get('/:nameSlugify/published', isLoggedAndOwner, global.md.nameSlugify(entity), controller.published);

router.post('/create', isLoggedAndOwner, controller.create);
router.post('/delete', isLoggedAdminOrOwner, controller.delete);
router.post('/update', isLoggedAdminOrOwner, controller.update);

router.post('/featured', global.md.isAdmin, controller.featured);
router.post('/unfeatured', global.md.isAdmin, controller.unFeatured);

router.post('/availability', isLoggedAndOwner, controller.availability);
router.post('/like', isLoggedAndOwner, controller.like);

router.post('/review/create', isLoggedAndOwner, controller.createReview);

// router.post('/review/delete', isLoggedAdminOrOwner, controller.deleteReview);
// router.post('/review/update', isLoggedAdminOrOwner, controller.updateReview);
// router.post('/public', isLoggedAdminOrOwner, controller.public);
// router.post('/private', isLoggedAdminOrOwner, controller.private);

router.post('/remove_from_collection', isLoggedAndOwner, controller.removeFromCollection);
router.post('/add_to_collection', isLoggedAndOwner, controller.addToCollection);
router.post('/inside_collection', isLoggedAndOwner, controller.insideCollection);

module.exports = router;
