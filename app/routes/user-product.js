var express = require('express');
var router = express.Router();
router.mergeParams = true;

var config = require('../../config/config');
var controller = require(config.controllersDir + "/user-product");
var middlewares = require(config.middlewaresDir + "/app");

router.use(function (req, res, next) {
    var query;
    if (req.body.idProduct)
        query = {where: {id: req.body.idProduct}};

    if (req.params.name)
        query = {where: {nameSlugify: req.params.name}};

    if (query === undefined)
        return next();

    global.db.Product.find(query).then(function (product) {
        if (!product) {
            if (req.xhr)
                return res.badRequest('Product not exists');

            req.flash('errorMessage', 'Product not exists');
            return res.redirect('back');
        }
        req.product = product;
        next();
    });
});

router.get('/add', middlewares.isLogged, controller.add);
router.get('/:name', controller.index);

router.post('/create', controller.create);
router.post('/delete', controller.delete);
router.post('/update', controller.update);

router.post('/featured', controller.featured);
router.post('/unfeatured', controller.unFeatured);
router.post('/like', controller.like);
router.post('/unlike', controller.unLike);

router.post('/public', controller.public);
router.post('/private', controller.private);

module.exports = router;