var basePath = 'user/account/';

exports.index = function (req, res) {
    return res.json('ggpe :v');
};

exports.add = function (req, res) {
    req.body.option = req.body.option || 1;
    var query = {where: {ProductId: req.body.idProduct, option: req.body.option}, limit: 1};
    req.user.getProductCarts(query).then(function (productCarts) {
        var productCart = productCarts[0];
        if (!productCart) {
            console.log('product cart');
            var payload = {
                ProductId: req.body.idProduct,
                UserId: req.user.id,
                option: req.body.option,
                items: 1
            };
            global.db.ProductCart.create(payload).then(function () {
                return res.ok(null, 'product added to cart');
            });
        }
        else {
            productCart.items += 1;
            productCart.save().then(function () {
                return res.ok(null, 'product with option ' + req.body.option + ' added');
            })
        }
    });
};

exports.remove = function (req, res) {
    req.body.option = req.body.option || 1;
    var query = {where: {ProductId: req.body.idProduct, option: req.body.option}, limit: 1};
    req.user.getProductCarts(query).then(function (productCarts) {
        var productCart = productCarts[0];
        if (!productCart)
            return res.badRequest(null, 'Producto inexisistente en el carrito');

        productCart.destroy().then(function () {
            return res.ok(null, 'Producto quitado del carrito');
        });
    });
};

exports.items = function (req, res) {
    req.body.option = req.body.option || 1;
    var query = {where: {ProductId: req.body.idProduct, option: req.body.option}, limit: 1};
    req.user.getProductCarts(query).then(function (productCarts) {
        var productCart = productCarts[0];
        if (!productCart)
            return res.badRequest(null, 'Producto inexisistente en el carrito');
        productCart.items = req.body.items;
        productCart.save().then(function () {
            return res.ok(null, 'Producto cambio numero de items');
        });
    });
};