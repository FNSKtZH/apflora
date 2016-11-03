/**
 * Baut das Projekt für die Produktion
 */

'use strict'

var gulp = require('gulp')
var requireDir = require('require-dir')
var runSequence = require('run-sequence')

requireDir('../gulp-tasks', { recurse: true })

gulp.task('prod', function () {
  runSequence(
    'templates',
    'browserify',
    ['prod_build_style', 'prod_build_src', 'prod_build_html'],
    'prod_copy'
  )
})
