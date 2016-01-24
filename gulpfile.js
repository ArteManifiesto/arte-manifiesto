  /**
 * @author www.juliocanares.com/cv
 * @email juliocanares@gmail.com
 */
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var stylus = require('gulp-stylus');
var nib = require('nib');

var paths = {
    jsDir: './app/scripts/src/**/*.js',
    vendorDir: [
      './app/scripts/vendor/adapt.js',
      './app/scripts/vendor/eventdispatcher.js',
      './app/scripts/vendor/broadcaster.js',
      './app/scripts/vendor/jquery.js',
      './app/scripts/vendor/cookie.js',
      './app/scripts/vendor/imagesloaded.js',
      './app/scripts/vendor/masonry.js',
      './app/scripts/vendor/moment.js',
      './app/scripts/vendor/underscore.js',
      './app/scripts/vendor/bootstrap.js',
      './app/scripts/vendor/slider.js',
      './app/scripts/vendor/slick.js',
      './app/scripts/vendor/photoswipe-ui-default.js',
      './app/scripts/vendor/photoswipe.js',
      './app/scripts/vendor/jquery.ui.widget.js',
      './app/scripts/vendor/jquery.tagsinput.js',
      './app/scripts/vendor/jquery.maskedinput.js',
      './app/scripts/vendor/jquery.leanModal.js',
      './app/scripts/vendor/jquery.iframe-transport.js',
      './app/scripts/vendor/jquery.fileupload.js',
      './app/scripts/vendor/jquery.darktooltip.js',
      './app/scripts/vendor/jquery.cloudinary.js',
      './app/scripts/vendor/hammer.js',
      './app/scripts/vendor/clipboard.js',
      './app/scripts/vendor/fabric.js',
      './app/scripts/vendor/medium-editor.js',
      './app/scripts/vendor/medium-editor-insert-plugin.js'
  ],
    stylesDir: './app/styles/**/*.styl',
    publicDir: './public/'
};

gulp.task('development', ['watch'], function(){
    console.log('running in development');
});

gulp.task('watch', function () {
  gulp.watch(paths.jsDir, ['scripts']);
  gulp.watch(paths.vendorDir, ['vendor']);
  gulp.watch(paths.stylesDir, ['styles']);
});

gulp.task('vendor', function () {
    return gulp.src(paths.vendorDir)
        .pipe(uglify({compress: true}))
        .pipe(concat('vendor.min.js'))
        .pipe(gulp.dest(paths.publicDir));
});

gulp.task('scripts', function () {
    return gulp.src(paths.jsDir)
        // .pipe(uglify({compress: true}))
        .pipe(concat('app.min.js'))
        .pipe(gulp.dest(paths.publicDir));
});

gulp.task('styles', function () {
    gulp.src(paths.stylesDir)
        .pipe(stylus({compress: true, use: [nib()]}))
        .pipe(concat('app.min.css'))
        .pipe(gulp.dest(paths.publicDir));
});

gulp.task('default', ['development'])
