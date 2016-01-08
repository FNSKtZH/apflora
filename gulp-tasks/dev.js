/**
 * Baut das Projekt für die Entwicklung
 */

'use strict'

var gulp = require('gulp')
var requireDir = require('require-dir')
var runSequence = require('run-sequence')

requireDir('../gulp-tasks', {recurse: true})

gulp.task('dev', function () {
  runSequence(
    'templates',
    'browserify',
    ['dev_style', 'dev_src'],
    'watch'
  )
})
