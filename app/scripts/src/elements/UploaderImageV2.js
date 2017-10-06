/**
 * Created by Jean Carlo on 05/10/2017.
 */

var APP = APP || {};

/*
 init s3
 */

var albumBucketName = 'am-images-original';
var bucketRegion = 'us-east-1';
var IdentityPoolId = 'us-east-1:345514fa-cde0-4cb5-ab22-8f8a60522cf4';

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


APP.UploaderImageV2 = function (upload, preview) {
    this.listeners();
    this.imagePreview = upload;
    this.imageUpload = preview;
};

APP.UploaderImageV2.constructor = APP.UploaderImageV2;

// JCC
APP.UploaderImageV2.prototype.listeners = function () {
    this.previewImage.bind(this);
};

APP.UploaderImageV2.prototype.previewImage = function (e) {
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
