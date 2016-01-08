'use strict'

var gulp = require('gulp')
var requireDir = require('require-dir')

requireDir('../gulp-tasks', {recurse: true})

gulp.task('dev_src_when_watch', ['browserify'], function () {
  gulp.start('dev_src')
})
