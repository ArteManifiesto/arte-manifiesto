var Chance = require('chance');
var chance = new Chance();
var _ = require('lodash');

exports.start = function () {
    var seeds = [
        seedCategory(),
        seedTag(20),
        seedProductType()
    ];
    return global.db.Sequelize.Promise.all(seeds).then(function () {
        return seedUser(10);
    });
};

var seedCategory = function () {
    var categories = [
        {name: 'Arte Urbano'}, {name: 'Collage'}, {name: 'Dibujo'},
        {name: 'Fotografía'}, {name: 'Grabado'}, {name: 'Ilustración'},
        {name: 'Instalación'}, {name: 'Pintura'}, {name: 'Técnica Mixta'},
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
    var i, username, email, promises = [];
    for (i = 0; i < numOfUsers; i++) {
        if (i == 0) {
            username = 'juliocanares';
            email = 'juliocanares@gmail.com';
        } else if (i == 1) {
            username = 'hanshavin';
            email = 'hansevangelista@gmail.com';
        } else if (i == 2) {
            username = 'artjam';
            email = 'artjam@gmail.com';
        }
        else {
            username = chance.hashtag().replace('#', '');
            email = chance.email();
        }

        promises.push(global.db.User.create({
            username: username,
            email: email,
            firstname: chance.name(),
            lastname: chance.last(),
            gender: chance.gender(),
            photo: '/img/artists/artist' + _.random(1, 4) + '.jpg',
            isArtist: true,
            city: chance.city(),
            country: chance.country(),
            school: chance.name(),
            bigraphy: chance.paragraph({sentences: 1}),
            isAdmin: _.sample([true, false])
        }));
    }

    return global.db.Sequelize.Promise.all(promises);
};