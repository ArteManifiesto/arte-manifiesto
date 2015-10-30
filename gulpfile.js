  /**
 * @author www.juliocanares.com/cv
 * @email juliocanares@gmail.com
 */
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var stylus = require('gulp-stylus');
var nib = require('nib');
var nodemon = require('gulp-nodemon');

var paths = {
    jsDir: './app/javascript/**/*.js',
    stylesDir: './app/styles/**/*.styl',
    publicDir: './public/'
};

gulp.task('development', ['watch'], function(){
    console.log('running in development');
});

gulp.task('watch', function () {
    gulp.watch(paths.jsDir, ['javascript']);
    gulp.watch(paths.stylesDir, ['styles']);
});

gulp.task('javascript', function () {
    return gulp.src(paths.jsDir)
        //.pipe(uglify({compress: true}))
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
