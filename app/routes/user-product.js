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
router.get('/:nameSlugify/products', global.md.nameSlugify(entity), controller.index.bind(this, 'products'));


router.get('/:nameSlugify/buy', global.md.isLogged, global.md.nameSlugify(entity), controller.buyPage);

router.get('/:nameSlugify/success', global.md.isLogged, global.md.nameSlugify(entity), controller.successPage);
router.get('/:nameSlugify/canceled', global.md.isLogged, global.md.nameSlugify(entity), controller.canceledPage);
router.post('/create', isLoggedAndOwner, controller.create);

// router.post('/buy', global.md.isLogged, controller.buy);

// router.post('/delete', isLoggedAndOwner, controller.delete);
// router.post('/update', isLoggedAndOwner, controller.update);

router.post('/review/create', isLoggedAndOwner, controller.createReview);

router.post('/shipping', controller.shipping);
router.post('/:nameSlugify/submit', global.md.nameSlugify(entity), controller.submit);
router.post('/:nameSlugify/remove', global.md.nameSlugify(entity), controller.removeSubmit);
router.post('/:nameSlugify/payu', global.md.nameSlugify(entity), controller.payuResponse);

router.post('/like', isLoggedAndOwner, controller.like);
router.post('/unlike', isLoggedAndOwner, controller.unLike);
router.post('/featured', global.md.isAdmin, controller.featured);
router.post('/unfeatured', global.md.isAdmin, controller.unFeatured);

router.post('/add_to_collection', isLoggedAndOwner, controller.addToCollection);
router.post('/inside_collection', isLoggedAndOwner, controller.insideCollection);

module.exports = router;