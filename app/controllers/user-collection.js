var basePath = 'user/collection/';

exports.index = function (req, res) {
    var query = {build: true, viewer: req.viewer};
    req.collection.getWorks(query).then(function (works) {
        return res.render(basePath + 'index', {
            collection: req.collection,
            works: works
        });
    });
}

exports.all = function (req, res) {
    var query;
    if (req.body.idProduct)
        query = {idProduct: req.body.idProduct, productInside: true};
    req.user.getCollections(query).then(function (collections) {
        return res.ok({collections: collections}, 'Colecciones listadas');
    });
}

/**
 * Collection create
 * ====================================================================
 * create a collection
 */
exports.create = function (req, res) {
    req.body.meta = 'products';
    global.db.Collection.create(req.body, {user: req.user}).then(function (collection) {
        req.user.addCollection(collection).then(function () {
            if (req.xhr)
                return res.ok({collection: collection}, 'Coleccion creada');
        })
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
