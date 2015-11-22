var basePath = 'user/account/';
var moment = require('moment');

var cloudinary = require('cloudinary').v2;
process.env.CLOUDINARY_URL = 'cloudinary://337494525976864:RQ2MXJev18AjVuf-mSNzdmu2Jsc@hackdudes'
cloudinary.config();


exports.index = function (req, res) {
    var cloudinary_cors = "http://" + req.headers.host + "/cloudinary_cors.html";
    var promises = [
      global.db.Category.findAll({appendWork:true}),
      req.user.getInterests()
    ];

    global.db.Sequelize.Promise.all(promises).then(function (result) {
      return res.render(basePath + 'index', {
        categories: result[0],
        interests: result[1],
        cloudinary_cors: cloudinary_cors,
        cloudinary: cloudinary,
        context: req.query.context
      });
    });
};

exports.update = function (req, res) {
    req.body.birthday = moment(req.body.birthday, 'DDMMYY');
    req.body.filled = true;
    req.body.fullname = req.body.firstname + ' ' + req.body.lastname;
    //var specialtiesData = req.body.specialties;
    var interestsData = req.body.interests || [];

    console.log(interestsData);
    var promises = [
        //global.db.Category.findAll({where: {id: {in: specialtiesData}}}),
        global.db.Category.findAll({where: {id: {in: interestsData}}})
    ];

    global.db.Sequelize.Promise.all(promises).then(function (result) {
        //var specialties = result[0];
        var interests = result[0];
        promises = [
            req.user.updateAttributes(req.body),
            //req.user.setSpecialties(specialties),
            req.user.setInterests(interests)
        ];

        global.db.Sequelize.Promise.all(promises).then(function () {
            return res.ok({user: req.user}, 'User updated');
        });
    });
};

//TODO make possible that the user can have multiple photos
exports.photo = function (req, res) {
    return res.render(basePath + 'photo');
};

exports.photoUpdate = function (req, res) {
    req.user.updateAttributes(req.body).then(function () {
        if (req.xhr)
            return res.ok({user: req.user}, 'Foto actualizada');
        req.flash('successMessage', 'Foto actualizada');
        return res.redirect('back');
    });
}

exports.addresses = function (req, res) {
    req.user.getAddresses().then(function (addresses) {
        return res.render(basePath + 'addresses', {addresses: addresses});
    });
};

exports.addressAdd = function (req, res) {
    global.db.Address.create(req.body).then(function (address) {
        req.user.addAddress(address).then(function () {
            if (req.xhr)
                return res.ok({address: address}, 'Direccion añadida');
            req.flash('successMessage', 'Direccion añadida');
            return res.redirect('back');
        });
    });
};

exports.addressUpdate = function (req, res) {
    global.db.Address.findById(req.body.idAddress).then(function (address) {
        address.updateAttributes(req.body).then(function () {
            address.setUser(req.user).then(function () {
                if (req.xhr)
                    return res.ok({address: address}, 'Direccion actualizada');
                req.flash('successMessage', 'Direccion actualizada');
                return res.redirect('back');
            });
        });
    })
};

exports.password = function (req, res) {
    return res.render(basePath + 'password');
};

exports.passwordUpdate = function (req, res) {
    req.user.salt = req.user.makeSalt();
    req.user.hashedPassword = req.user.encryptPassword(req.body.password, req.user.salt);
    req.user.tokenResetPassword = null;
    req.user.tokenResetPasswordExpires = null;
    req.user.save().then(function () {
        if (req.xhr)
            return res.ok({user: req.user}, 'Contraseña cambiada');
        req.flash('successMessage', 'Contraseña cambiada');
        return res.redirect('back');
    });
};


exports.updateCover = function(req,res) {
  req.user.updateAttributes(req.body).then(function(){
    if (req.xhr)
        return res.ok({user: req.user}, 'Cover actualizado');
  });
};
