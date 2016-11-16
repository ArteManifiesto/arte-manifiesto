/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

var normal = (function() {
  var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç",
    to = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
    mapping = {};

  for (var i = 0, j = from.length; i < j; i++)
    mapping[from.charAt(i)] = to.charAt(i);

  return function(str) {
    var ret = [];
    for (var i = 0, j = str.length; i < j; i++) {
      var c = str.charAt(i);
      if (mapping.hasOwnProperty(str.charAt(i)))
        ret.push(mapping[c]);
      else
        ret.push(c);
    }
    return ret.join('');
  }
})();

APP.BuyScreen = function() {
  this.productConfig = JSON.parse(product.config);
  APP.BaseScreen.call(this, 'buy');
  this.totalShipping;
  this.currentIgv;
  this.totalPrice;
};

APP.BuyScreen.constructor = APP.BuyScreen;
APP.BuyScreen.prototype = Object.create(APP.BaseScreen.prototype);

APP.BuyScreen.prototype.setupUI = function() {
  this.payBtn = $('.btn-pay');
  this.form = $('form[name=buy-form]');
};

APP.BuyScreen.prototype.listeners = function() {
  APP.BaseScreen.prototype.listeners.call(this);

  $('select[name=city]').change(this.cityChangeHandler.bind(this));
  $('select[name=city]').change();
  this.form.submit(this.submitHandler.bind(this));

  $('input[name=direction]').geocomplete();
};

APP.BuyScreen.prototype.submitHandler = function(e) {
  var firstname = $('input[name=firstname]').val();
  var lastname = $('input[name=lastname]').val();
  var direction = $('input[name=direction]').val();
  var departament = $('input[name=departament]').val();
  var city = $('select[name=city]').val();
  var province = $('input[name=province]').val();
  var zipcode = $('input[name=zipcode]').val();
  var country = $('select[name=country]').val();
  var phone = $('input[name=phone]').val();
  var email = $('input[name=email]').val();

  var errors = [];

  if (Validations.notBlank(firstname)) errors.push('Ingrese un nombre');
  if (Validations.notBlank(lastname)) errors.push('Ingrese tus apellidos');
  if (Validations.notBlank(direction)) errors.push('Ingrese una dirección');

  if (Validations.notBlank(city)) errors.push('Ingrese tú ciudad');
  if (Validations.notBlank(province)) errors.push('Ingrese tú provincia');
  if (Validations.notBlank(zipcode)) errors.push('Ingrese el código postal');
  if (Validations.notBlank(phone)) errors.push('Ingrese tú telefono');
  if (Validations.notBlank(email)) errors.push('Ingrese tú correo');

  if (errors.length > 0) return this.showFlash('error', errors);

  var data = {
    firstname: firstname,
    lastname: lastname,
    direction: direction,
    departament: departament,
    city: city,
    province: province,
    zipcode: zipcode,
    country: country,
    phone: phone,
    email: email,
  }

  $('<input type="hidden" name="data" value=' + JSON.stringify(data) + '>')
    .appendTo(this.form);

  $('<input type="hidden" name="shipping" value=' + this.totalShipping + '>')
    .appendTo(this.form);

  $('<input type="hidden" name="price" value=' + this.totalPrice + '>')
    .appendTo(this.form);

  data.shipping = this.totalShipping;
  data.price = this.price;

  Cookies.set('order_data', JSON.stringify(data), {
    maxAge: 3600000,
    domain: '.' + document.domain
  });
};

APP.BuyScreen.prototype.cityChangeHandler = function() {
  var name = normal($('select[name=city]').val());
  var url = '/user/' + product.User.username + '/product/shipping';
  if (name === 'Pucallpa') name = 'PUCALLPA (CALLERIA)';
  if (name === 'Chincha') name = 'CHINCHA ALTA';

  var payload = {
    "nom_destino": name.toUpperCase(),
    "peso": this.productConfig.pkgWeight,
    "servicio": "Atencion en Oficina",
    "options2": "Kilos",
    "largo": this.productConfig.pkgLarge,
    "ancho": this.productConfig.pkgWidth,
    "alto": this.productConfig.pkgHeight,
    "cantidad": 1,
    "m_largo": "cms",
    "m_ancho": "cms",
    "m_alto": "cms"
  }
  this.requestHandler(url, {
    config: JSON.stringify(payload)
  }, this.shippingHandler);
};

APP.BuyScreen.prototype.shippingHandler = function(response) {
  var data = response.data.data;

  this.totalShipping = 5.00;
  this.totalPrice = Number(product.finalPrice) + this.totalShipping;

  $('.subtotal').text(product.finalPrice + ".00");
  $('.baseprice').text(this.totalShipping);
  $('.totallity').text(this.totalPrice);
};