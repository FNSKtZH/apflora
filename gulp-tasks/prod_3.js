/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var gulp       = require('gulp'),
    requireDir = require('require-dir'),
    notifier   = require('node-notifier');

return gulp.task('prod_3', ['prod_copy'], function () {
    notifier.notify({
        'title': 'finished',
        'message': 'prod code built and copied to ./dist'
    });
});