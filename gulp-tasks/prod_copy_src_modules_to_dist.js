/*jslint node: true, browser: true, nomen: true, todo: true, asi: true */
'use strict'

var gulp = require('gulp')

gulp.task('prod_copy_src_modules_to_dist', function () {
  return gulp.src('src/modules/**/*')
    .pipe(gulp.dest('dist/src/modules'))
})
