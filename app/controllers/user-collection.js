var basePath = 'user/collection/';

exports.all = function (req, res) {
    req.user.getCollections().then(function (collections) {
        return res.ok({collections: collections}, 'Colecciones listadas');
    });
}

/**
 * Collection create
 * ====================================================================
 * create a collection
 */
exports.create = function (req, res) {
    global.db.Collection.create(req.body).then(function (collection) {
        req.user.addCollection(collection).then(function () {
            if (req.xhr)
                return res.ok({collection: collection}, 'Coleccion creada');
        })
    });
};

/**
 * Collection read
 * ====================================================================
 * read a collection
 */
exports.read = function (req, res) {
    req.collection.getProducts().then(function (products) {
        return res.json({collection: req.collection, products: products});
    });
};

/**
 * Collection update
 * ====================================================================
 * update collection
 */
exports.update = function (req, res) {
    req.collection.updateAttributes(req.body).then(function () {
        return res.ok({collection: req.collection}, 'Coleccion actualizada');
    });
};

/**
 * Collection remove
 * ====================================================================
 * remove a collection
 */
exports.delete = function (req, res) {
    req.collection.destroy().then(function () {
        return res.ok({collection: req.collection}, 'Coleccion eliminada');
    });
};

exports.public = function (req, res) {
    req.collection.updateAttributes({public: true}).then(function () {
        return res.ok({collection: req.collection}, 'Coleccion publica');
    });
};

exports.private = function (req, res) {
    req.collection.updateAttributes({public: false}).then(function () {
        return res.ok({collection: req.collection}, 'Coleccion privada');
    });
};