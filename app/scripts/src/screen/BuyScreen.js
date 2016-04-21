/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

var normal = (function() {
  var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç",
      to   = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
      mapping = {};

  for(var i = 0, j = from.length; i < j; i++ )
      mapping[ from.charAt( i ) ] = to.charAt( i );

  return function( str ) {
      var ret = [];
      for( var i = 0, j = str.length; i < j; i++ ) {
          var c = str.charAt( i );
          if( mapping.hasOwnProperty( str.charAt( i ) ) )
              ret.push( mapping[ c ] );
          else
              ret.push( c );
      }
      return ret.join( '' );
  }
})();

APP.BuyScreen = function() {
  this.productConfig = JSON.parse(product.config);
  APP.BaseScreen.call(this, 'buy');
  this.currentShipping;
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
};

APP.BuyScreen.prototype.submitHandler = function() {
  $('<input type="hidden" name="shipping" value='+ this.currentShipping +'>')
    .appendTo(this.form);

  $('<input type="hidden" name="igv" value='+ this.currentIgv +'>')
    .appendTo(this.form);

  $('<input type="hidden" name="price" value='+ this.totalPrice +'>')
    .appendTo(this.form);
};

APP.BuyScreen.prototype.cityChangeHandler = function() {
  var name = normal($('select[name=city]').val());
  var url = '/user/'+ product.User.username + '/product/shipping';
  if(name === 'Pucallpa') name = 'PUCALLPA (CALLERIA)';
  if(name === 'Chincha') name = 'CHINCHA ALTA';

  var payload = {
    "nom_destino": name.toUpperCase(),
    "peso": this.productConfig.weightKG,
    "servicio": "Atencion en Oficina",
    "options2": "Kilos",
    "largo": this.productConfig.largeCM,
    "ancho": this.productConfig.widthCM,
    "alto": this.productConfig.heightCM,
    "cantidad": 1,
    "m_largo": "cms",
    "m_ancho": "cms",
    "m_alto": "cms"
  }
  this.requestHandler(url, {config: JSON.stringify(payload)}, this.shippingHandler);
};

APP.BuyScreen.prototype.shippingHandler = function(response) {
  var data = response.data.data;
  this.currentShipping = data.monto_base;
  this.currentIgv = data.monto_igv;
  this.totalPrice = Number(product.finalPrice) + Number(data.monto_base) + Number(data.monto_igv);

  $('.subtotal').text(product.finalPrice);
  $('.baseprice').text(this.currentShipping);
  $('.igv').text(this.currentIgv);

  $('.totallity').text(this.totalPrice);
};
