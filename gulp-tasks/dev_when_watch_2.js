/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';


var gulp       = require('gulp');
var requireDir = require('require-dir');

requireDir('../gulp-tasks', {recurse: true});

return gulp.task('dev_when_watch_2', ['dev_src']);