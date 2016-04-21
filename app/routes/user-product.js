var express = require('express');
var router = express.Router({
  mergeParams: true
});

var controller = require(global.cf.controllers + "/user-product");

var isLoggedAndOwner = [global.md.isLogged, global.md.isOwner];
var entity = 'Product';

router.use(global.md.entity(entity));

router.get('/:nameSlugify', global.md.nameSlugify(entity), controller.index.bind(this, 'index'));
router.get('/:nameSlugify/reviews', global.md.nameSlugify(entity), controller.index.bind(this, 'reviews'));
router.get('/:nameSlugify/tags', global.md.nameSlugify(entity), controller.index.bind(this, 'tags'));


router.get('/:nameSlugify/buy', global.md.isLogged, global.md.nameSlugify(entity), controller.buyPage);

router.get('/:nameSlugify/success', global.md.isLogged, global.md.nameSlugify(entity), controller.successPage);
router.get('/:nameSlugify/canceled', global.md.isLogged, global.md.nameSlugify(entity), controller.canceledPage);

router.post('/create', isLoggedAndOwner, controller.create);
router.post('/buy', isLoggedAndOwner, controller.buy);

// router.post('/delete', isLoggedAndOwner, controller.delete);
// router.post('/update', isLoggedAndOwner, controller.update);

router.post('/review/create', isLoggedAndOwner, controller.createReview);

router.post('/shipping', isLoggedAndOwner, controller.shipping);
router.post('/like', isLoggedAndOwner, controller.like);
router.post('/unlike', isLoggedAndOwner, controller.unLike);
router.post('/featured', isLoggedAndOwner, controller.featured);
router.post('/unfeatured', isLoggedAndOwner, controller.unFeatured);

router.post('/add_to_collection', isLoggedAndOwner, controller.addToCollection);
router.post('/inside_collection', isLoggedAndOwner, controller.insideCollection);

module.exports = router;
