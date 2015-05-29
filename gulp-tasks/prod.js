/**
 * Baut das Projekt für die Produktion
 */

/*jslint node: true, browser: true, nomen: true, todo: true, asi: true */
'use strict';

var gulp        = require('gulp'),
    requireDir  = require('require-dir'),
    runSequence = require('run-sequence'),
    notifier    = require('node-notifier');

requireDir('../gulp-tasks', {recurse: true});

return gulp.task('prod', function () {
    runSequence(
        'templates',
        ['browserify', 'prod_clean_dist'],
        ['prod_build_style', 'prod_build_src', 'prod_build_html'],
        'prod_copy',
        'prod_notify'
    );
});