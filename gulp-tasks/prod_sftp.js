/**
 * beamt die Dateien aus dem dist-Ordner nach apflora.ch
 */

'use strict'

var gulp = require('gulp')
var requireDir = require('require-dir')
var runSequence = require('run-sequence')

requireDir('../gulp-tasks', {recurse: true})

gulp.task('prod_sftp', function () {
  runSequence(
    'prod_sftp_sftp',
    'prod_clean_dist'
  )
})
