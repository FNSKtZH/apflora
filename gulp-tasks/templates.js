'use strict'

var gulp = require('gulp'),
  gulpHandlebars = require('gulp-handlebars'),
  handlebars = require('handlebars'),
  defineModule = require('gulp-define-module')

gulp.task('templates', function () {
  return gulp.src('src/templatesDev/**/*')
    .pipe(gulpHandlebars({ handlebars: handlebars }))
    .pipe(defineModule('node'))
    .pipe(gulp.dest('./src/templates'))
})
