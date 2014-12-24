var gulp         = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss    = require('gulp-minify-css'),
    concat       = require('gulp-concat-sourcemap');

gulp.task('prod_build_style', function () {
    return gulp.src([
        'style/jquery.qtip.css',
        'style/apflora.css',
        'jquery-ui.css'
    ])
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(concat('main_built.css'))
        .pipe(minifycss())
        .pipe(gulp.dest('style'));
});