/*jslint node: true, browser: true, nomen: true, todo: true, asi: true */
'use strict'

var gulp = require('gulp')

gulp.task('prod_copy_style_to_dist', function () {
  return gulp.src('style/**/*')
    .pipe(gulp.dest('dist/style'))
})
