var Chance = require('chance');
var chance = new Chance();
var _ = require('lodash');

exports.start = function () {
    var seeds = [
        seedCategory()
    ];
    return global.db.Sequelize.Promise.all(seeds);
};

var seedCategory = function () {
    var categories = [
        {name: 'Arte Urbano'}, {name: 'Collage'}, {name: 'Dibujo'},
        {name: 'Fotografia'}, {name: 'Grabado'}, {name: 'Ilustracion'},
        {name: 'Instalacion'}, {name: 'Pintura'}, {name: 'Tecnica Mixta'},
        {name: 'Digital'}, {name: 'Escultura'}
    ];
    return global.db.Category.bulkCreate(categories);
};

var seedTag = function (numOfTags) {
    var i, tagsData = [];
    for (i = 0; i < numOfTags; i++)
        tagsData.push({name: chance.word()});
    return global.db.Tag.bulkCreate(tagsData);
};

var seedProductType = function () {
    var productsType = [
        {name: 'Prints'}, {name: 'Tazas'}, {name: 'Polos'},
        {name: 'Carteras'}, {name: 'Gorras'}, {name: 'Tatuajes'}
    ];
    return global.db.ProductType.bulkCreate(productsType);
};

var seedUser = function (numOfUsers) {
    var data = []
    var i, promises = [];
    for (i = 0; i < data.length; i++) {
        if(_.isNumber(data[i].username)) data[i].username = ''
        if(_.isNumber(data[i].firstname)) data[i].firstname = ''
        if(_.isNumber(data[i].lastname)) data[i].lastname = ''

        promises.push(global.db.User.create(data[i]));
    }

    return global.db.Sequelize.Promise.all(promises);
};
