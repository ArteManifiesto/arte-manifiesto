/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

/*
 init s3
 */

var albumBucketName = 'am-original';
var bucketRegion = 'US East (Ohio)';
var IdentityPoolId = 'us-east-1_z9ezNHfEv';

AWS.config.update({
    region: bucketRegion,
    credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: IdentityPoolId
    })
});

var s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    params: {Bucket: albumBucketName}
});

/*
 fin init s3
 */


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

        console.log(scope.uploader[0].files[0])
        console.log(listAlbums())

        addPhoto(scope.uploader[0].files)


    });
};

function listAlbums() {
    s3.listObjects({Delimiter: '/'}, function (err, data) {
        if (err) {
            return alert('There was an error listing your albums: ' + err.message);
        } else {
            var albums = data.CommonPrefixes.map(function (commonPrefix) {
                var prefix = commonPrefix.Prefix;
                var albumName = decodeURIComponent(prefix.replace('/', ''));
                return getHtml([
                    '<li>',
                    '<span onclick="deleteAlbum(\'' + albumName + '\')">X</span>',
                    '<span onclick="viewAlbum(\'' + albumName + '\')">',
                    albumName,
                    '</span>',
                    '</li>'
                ]);
            });
            console.log(albums)
        }
    });
}

function addPhoto(file) {
    var files = file;
    if (!files.length) {
        return alert('Please choose a file to upload first.');
    }
    var file = files[0];
    var fileName = file.name;
    var albumPhotosKey = encodeURIComponent(albumBucketName) + '//';

    var photoKey = albumPhotosKey + fileName;
    s3.upload({
        Key: photoKey,
        Body: file,
        ACL: 'public-read'
    }, function (err, data) {
        if (err) {
            return alert('There was an error uploading your photo: ', err.message);
        }
        alert('Successfully uploaded photo.');
        viewAlbum(albumBucketName);
    });
}