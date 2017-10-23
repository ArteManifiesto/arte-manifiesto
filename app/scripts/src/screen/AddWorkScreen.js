/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.AddWorkScreen = function () {
    APP.BaseScreen.call(this, 'addWork');
    this.work = null;
};

APP.AddWorkScreen.constructor = APP.AddWorkScreen;
APP.AddWorkScreen.prototype = Object.create(APP.BaseScreen.prototype);

APP.AddWorkScreen.prototype.setupUI = function () {
    this.workForm = $('.work-form');
    this.uploader = $('.uploader-work');
    this.name = $('input[name=name]');
    this.category = $('select[name=category]');
    this.description = $('textarea[name=description]');

    this.tags = $('input[name=tags]');
    this.tags.tagsInput({
        height: '50px',
        width: '100%',
        defaultText: '+Etiqueta'
    });

    this.send = $('.send');
    this.sendLoading = $('.send-loading');

    this.workDelete = $('.work-delete');
    this.workDeleteConfirm = $('.work-delete-confirm');
    this.workDeleteCancel = $('.work-delete-cancel');
    this.workDeleteForce = $('.work-delete-force');

    this.workPhotoPublished = $('.work-photo-published');
    this.workNamePublished = $('.work-name-published');
    this.workUserPublished = $('.work-user-published');
    this.workPublished = $('.work-published');
    this.workView = $('.work-view');
    this.workNew = $('.work-new');
    this.workEdit = $('.work-edit');
    this.imagePreview = $('#image-preview');
    this.imageUpload = $('#image-upload');


    //this.uploaderImage = new APP.UploaderImage(this.uploader, this.imgComplete);
    //this.uploaderImage = new APP.UploaderImageV2(this.imageUpload, this.imagePreview);
};

APP.AddWorkScreen.prototype.listeners = function () {
    APP.BaseScreen.prototype.listeners.call(this);
    this.workForm.submit(this.workFormSubmitHandlerV2.bind(this));
    this.workDelete.click(this.deleteHandler.bind(this));
    this.workDeleteForce.click(this.workDeleteForceHandler.bind(this));
    this.workDeleteCancel.click(this.deleteCancel.bind(this));
    this.imageUpload.change(this.previewImage.bind(this));
    $('input[type=checkbox]').change(this.publicHandler);
};

APP.AddWorkScreen.prototype.previewImage = function (e) {
    var preview = this.imagePreview
    var reader = new FileReader();

    reader.onerror = function (ev) {
        errors.push('Error al mostrar la foto');
    }
    reader.onload = function (ev) {
        preview.html("<img src='" + ev.target.result + "' style='width:300px;'>")
    };
    reader.readAsDataURL(e.target.files[0]);
}


APP.AddWorkScreen.prototype.publicHandler = function () {
    $(this).parent().find('.value').text((this.checked ? 'On' : 'Off'));
}

APP.AddWorkScreen.prototype.workFormSubmitHandlerV2 = function (event) {
    event.preventDefault();
    var errors = [],
        scope = this;

    if (scope.imageUpload[0].files.length == 0) errors.push('Ingrese una foto');
    if (Validations.notBlank(this.name.val())) errors.push('Ingrese un nombre');
    if (Validations.notBlank(this.category.val())) errors.push('Ingrese una categoria');
    if (Validations.notBlank(this.description.val())) errors.push('Ingrese una descripcion');
    if (this.tags.val().split(',')[0].length < 1) errors.push('Ingrese etiquetas');

    console.log(scope);
    if (errors.length > 0) return this.showFlash('error', errors);

    this.sendLoading.show();
    this.send.hide();
    var data = new FormData(this.workForm[0]);

    var url = DataApp.currentUser.url + '/work/create';
    console.log(url);
    debugger;
    this.requestHandlerImage(url, data, this.workCreatedCompleteV2);
};

APP.AddWorkScreen.prototype.workCreatedCompleteV2 = function (response) {
    this.showFlash('succes', 'Su obra se subió exitosamente')
    this.work = response.data.work;

    this.workForm.hide();

    this.sendLoading.hide();
    this.send.show();

    var url = DataApp.currentUser.url + '/work/' + this.work.nameSlugify
    var photo = Utils.addImageFilterV2(this.work.photo, 'w_300,c_limit');

    this.workView.attr('href', url);
    this.workNew.attr('href', DataApp.currentUser.url + '/work/add');
    this.workEdit.attr('href', url + '/edit');
    this.workPhotoPublished.attr('src', photo);
    this.workNamePublished.text(this.work.name);
    this.workUserPublished.text(DataApp.currentUser.fullname);
    this.workPublished.show();
};

APP.AddWorkScreen.prototype.workFormSubmitHandler = function (event) {
    event.preventDefault();
    var errors = [],
        scope = this;

    if (!this.uploaderImage.photo) errors.push('Ingrese una foto');
    if (Validations.notBlank(this.name.val())) errors.push('Ingrese un nombre');
    if (Validations.notBlank(this.category.val())) errors.push('Ingrese una categoria');
    if (Validations.notBlank(this.description.val())) errors.push('Ingrese una descripcion');
    if (this.tags.val().split(',')[0].length < 1) errors.push('Ingrese etiquetas');

    if (errors.length > 0) return this.showFlash('error', errors);

    this.sendLoading.show();
    this.send.hide();

    var data = this.workForm.serializeArray();

     $.each(data, function (index, value) {
     if (value.name === 'photo')
     value.value = scope.uploaderImage.photo;

     if (value.name === 'nsfw' || value.name === 'public')
     value.value = (value.value === 'on');
     });

    var url = DataApp.currentUser.url + '/work/create';
    this.requestHandler(url, data, this.workCreatedComplete);

};

APP.AddWorkScreen.prototype.workCreatedComplete = function (response) {
    this.showFlash('succes', 'Su obra se subió exitosamente')
    this.work = response.data.work;

    this.workForm.hide();

    this.sendLoading.hide();
    this.send.show();

    var url = DataApp.currentUser.url + '/work/' + this.work.nameSlugify
    var photo = Utils.addImageFilter(this.work.photo, 'w_300,c_limit');

    this.workView.attr('href', url);
    this.workNew.attr('href', DataApp.currentUser.url + '/work/add');
    this.workEdit.attr('href', url + '/edit');
    this.workPhotoPublished.attr('src', photo);
    this.workNamePublished.text(this.work.name);
    this.workUserPublished.text(DataApp.currentUser.fullname);
    this.workPublished.show();
};

APP.AddWorkScreen.prototype.deleteHandler = function (event) {
    this.workDelete.hide();
    this.workDeleteConfirm.show();
};

APP.AddWorkScreen.prototype.workDeleteForceHandler = function () {
    var url = DataApp.currentUser.url + '/work/delete';
    this.requestHandler(url, {
        idWork: this.work.id
    }, this.forceComplete);
};

APP.AddWorkScreen.prototype.forceComplete = function () {
    this.showFlash('succes', 'Se elimino tu obra');
    setTimeout(function () {
        window.location.href = DataApp.currentUser.url;
    }, 1000);
};

APP.AddWorkScreen.prototype.deleteCancel = function (response) {
    this.workDelete.show();
    this.workDeleteConfirm.hide();
};

APP.AddWorkScreen.prototype.imgComplete = function (idImage) {
    this.$view.find('.upload').show();
    $('.cloudinary-fileupload').show();
    var filters = {
        width: 300,
        crop: 'limit'
    };
    $.cloudinary.image(idImage, filters).appendTo(this.$view.find('.preview'));
};