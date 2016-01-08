'use strict'

var gulp = require('gulp')
var gulpHandlebars = require('gulp-handlebars')
var handlebars = require('handlebars')
var defineModule = require('gulp-define-module')

gulp.task('templates', function () {
  return gulp.src('src/templatesDev/**/*')
    .pipe(gulpHandlebars({ handlebars: handlebars }))
    .pipe(defineModule('node'))
    .pipe(gulp.dest('./src/templates'))
})
