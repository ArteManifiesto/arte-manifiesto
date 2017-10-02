/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

//var AWS = require('aws-sdk');
//var s3 = new global.aws.S3();


APP.UploaderImage = function (view, onComplete, options) {
    this.$view = view;
    this.photo = null;
    this.options = options || {
            uploader: $('.cloudinary-fileupload')
        };
    this.uploader = this.options.uploader;
    this.listeners();
    this.onComplete = onComplete;
};

APP.UploaderImage.constructor = APP.UploaderImage;

// JCC
APP.UploaderImage.prototype.listeners = function () {
    var scope = this;

    this.uploader.fileupload({
        start: function (e) {
            scope.$view.find('.upload').hide();
            $(this).hide();
            scope.$view.find('.preload').removeClass('hide');
            scope.$view.find('.preload').show();
        },
        fail: function (e, data) {
            scope.$view.find('.upload').show();
            $(this).show();
            scope.$view.find('.preload').hide();
        }
    })
        .off('cloudinarydone').on('cloudinarydone', function (e, data) {
        console.log(data)
        s3.listBuckets(function (err, data) {
            console.log(err, data);
        });
        scope.$view.find('.preload').hide();
        scope.$view.find('.preview').html('');
        scope.photo = data.result.url;
        if (!scope.onComplete) {
            var filters = {
                format: data.result.format,
                width: 200,
                height: 200,
                crop: "thumb"
            };
            $.cloudinary.image(data.result.public_id, filters).appendTo(scope.$view.find('.preview'));
        } else {
            scope.onComplete(data.result.public_id);
        }
    });
};