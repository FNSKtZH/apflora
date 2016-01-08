'use strict'

var gulp = require('gulp')
var requireDir = require('require-dir')
var runSequence = require('run-sequence')

requireDir('../gulp-tasks', {recurse: true})

gulp.task('templates_when_watch', function () {
  runSequence(
    'templates',
    'browserify'
  )
})
