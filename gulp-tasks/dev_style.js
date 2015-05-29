/*jslint node: true, browser: true, nomen: true, todo: true, asi: true */
'use strict'

var gulp = require('gulp'),
  concat = require('gulp-concat-sourcemap')

gulp.task('dev_style', function () {
  return gulp.src([
    'style/jquery.qtip.css',
    'style/apflora.css'
  ])
    .pipe(concat('apflora_built.css'))
    .pipe(gulp.dest('style'))
})
