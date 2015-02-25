/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var gulp = require('gulp');

gulp.task('prod_copy_geojson_to_dist', function () {
    return gulp.src('geojson/*')
        .pipe(gulp.dest('dist/geojson'));
});