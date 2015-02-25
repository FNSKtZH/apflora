/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var gulp = require('gulp');

gulp.task('prod_copy_kml_to_dist', function () {
    return gulp.src('kml/*')
        .pipe(gulp.dest('dist/kml'));
});