var basePath = 'user/cart/';

exports.index = function (req, res) {
    var query = {
        include: [{
            model: global.db.Product,
            include: [global.db.User]
        }]
    };
    req.user.getProductCarts(query).then(function (productCarts) {
        var i, productCart, result = {};
        for (i = 0; i < productCarts.length; i++) {
            productCart = productCarts[i];
            if (result[productCart.Product.User.username])
                result[productCart.Product.User.username].push(productCart);
            else
                result[productCart.Product.User.username] = [productCart];
        }

        return res.render(basePath + 'index', {
            products: result
        });
    });
};

exports.list = function (req, res) {
    //TODO implement get number total of products in the cart
    var query = {
        include: [{
            model: global.db.Product,
            include: [global.db.User]
        }],
        limit: 4
    };
    req.user.getProductCarts(query).then(function (productCarts) {
        return res.ok(productCarts, 'Productos listados');
    });
};

exports.add = function (req, res) {
    req.body.option = req.body.option || 1;

    var query = {
        where: {
            ProductId: req.body.idProduct,
            UserId: req.user.id,
            option: req.body.option
        },
        limit: 1
    };

    req.user.getProductCarts(query).then(function (productCarts) {
        var productCart = productCarts[0];

        if (!productCart) {
            var payload = {
                ProductId: req.body.idProduct,
                UserId: req.user.id,
                option: req.body.option, items: 1
            };
            return global.db.ProductCart.create(payload).then(function () {
                return res.ok(null, 'Producto agregado');
            });
        }

        productCart.items += 1;
        productCart.save().then(function () {
            return res.ok(null, 'Producto agregado');
        });
    });
};

exports.remove = function (req, res) {
    req.body.option = req.body.option || 1;

    var query = {
        where: {
            ProductId: req.body.idProduct,
            UserId: req.user.id,
            option: req.body.option
        },
        limit: 1
    };

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
    var query = {
        where: {
            ProductId: req.body.idProduct,
            UserId: req.user.id,
            option: req.body.option
        },
        limit: 1
    };

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
