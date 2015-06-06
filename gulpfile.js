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
var stripDebug = require('gulp-strip-debug');

var paths = {
    jsSource: './public/src/js/**/*.js',
    jsDist: './public/js/',
    stylusSource: './public/src/stylus/*.styl',
    cssDist: './public/css/'
};

gulp.task('watch', function () {
    gulp.watch(paths.jsSource, ['scripts']);
    gulp.watch(paths.stylusSource, ['stylus']);
});

gulp.task('scripts', function () {
    return gulp.src(paths.jsSource)
        //.pipe(uglify({compress: true}))
        //.pipe(stripDebug())
        .pipe(concat('app.min.js'))
        .pipe(gulp.dest(paths.jsDist));
});

gulp.task('stylus', function () {
    gulp.src(paths.stylusSource)
        .pipe(stylus({compress: true, use: [nib()]}))
        .pipe(gulp.dest(paths.cssDist));
});

gulp.task('develop', function () {
    nodemon({
        script: 'app.js',
        env: {
            'NODE_ENV': 'development',
            'DB_PASSWORD': ''
        },
        tasks: ['watch', 'scripts', 'stylus']
    }).on('restart', function () {
        console.log('restarted!')
    })
});

gulp.task('default', ['develop']);