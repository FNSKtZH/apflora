/**
 * Baut das Projekt für die Entwicklung
 */

/*jslint node: true, browser: true, nomen: true, todo: true, asi: true */
'use strict';

var gulp       = require('gulp'),
    requireDir = require('require-dir');

requireDir('../gulp-tasks', {recurse: true});

return gulp.task('default', ['dev']);