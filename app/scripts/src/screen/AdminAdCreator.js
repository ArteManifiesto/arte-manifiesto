/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.AdminAdCreator = function() {
  APP.BaseScreen.call(this, 'adminAdCreator');
};

APP.AdminAdCreator.constructor = APP.AdminAdCreator;
APP.AdminAdCreator.prototype = Object.create(APP.BaseScreen.prototype);

APP.AdminAdCreator.prototype.setupUI = function() {
  // this.sendBtn = $('button[data-id="send"]');

  this.nameCampaign = $('input[name=nameCampaign]');

  this.startDate = $('input[name=startDate]');
  this.startDate.datepicker();
  
  this.endDate = $('input[name=endDate]');
  this.endDate.datepicker();

  this.adPackType = $('input[name=adPackType]');

  this.ads = [];
};

APP.AdminAdCreator.prototype.listeners = function() {
  APP.BaseScreen.prototype.listeners.call(this);

  $('form').submit(this.formSubmit.bind(this));
  this.adPackType.change(this.adPackTypeChange.bind(this));

  if(edit) {
    $('input[name=adPackType][value="'+ adPack.AdPackType.id +'"]').attr('checked', true).change();
  }else {
    $('input[name=adPackType][data-index="0"]').attr('checked', true).change();
  }

  if(edit) {
    for(var i = 0; i< adPack.Ads.length; i++) {
      console.log(adPack.Ads[i]);
      this.ads[i].updateData(adPack.Ads[i]);
    }
  }
};

APP.AdminAdCreator.prototype.formSubmit = function(e) {
  e.preventDefault();

  var errors = [];

  var name = this.nameCampaign.val();
  var startDate = this.startDate.val();
  var endDate = this.endDate.val();

  var adPackType = $('input[name=adPackType]:checked').val();

  var ads = [];

  this.ads.map(function(value) {
    var v = value.getData();
    if(!v)
      errors.push('Llene los anuncios correctamente');
    else
      ads.push(v);
  });

  if(errors.length > 0)
    return this.showFlash('error', [errors[0]]);

  var payload = {
    name: name,
    startDate: startDate,
    endDate: endDate,
    adPackType: adPackType,
    ads: JSON.stringify(ads)
  };

  if(edit)  {
    payload.adPackId = adPack.id;
    payload.edit = true;
  }

  var url = DataApp.baseUrl + 'report/brands/'+ brand.id + '/ad-creator';
  this.requestHandler(url, payload, this.adCreatorComplete);
};

APP.AdminAdCreator.prototype.adCreatorComplete = function(e) {
  if(edit) {
    this.showFlash('succes', 'Campaña actualizada');
  } else {
    this.showFlash('succes', 'Campaña creada');
  }

  var timeout = setTimeout(function() {
    clearTimeout();
    return location.href = '/report/brands/' + brand.id + '/ads';
  }, 1000);
};

APP.AdminAdCreator.prototype.adPackTypeChange = function(e) {
 	var me = $(e.target);
 	var index = me.data('index');
	var adPackType = adPackTypes[index];

	$('.images-links').empty();
  this.ads = [];
	adPackType.Types.map((function(value) {
    var ad = new APP.AdCreator(value);
    this.ads.push(ad);
  	$('.images-links').append(ad.view);
	}).bind(this));
};