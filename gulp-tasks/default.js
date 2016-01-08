/**
 * Baut das Projekt für die Entwicklung
 */

'use strict'

var gulp = require('gulp')
var requireDir = require('require-dir')

requireDir('../gulp-tasks', {recurse: true})

gulp.task('default', ['dev'])
