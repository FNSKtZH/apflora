/*jslint node: true, browser: true, nomen: true, todo: true, asi: true */
'use strict';

var gulp       = require('gulp'),
    requireDir = require('require-dir'),
    notifier   = require('node-notifier');

requireDir('../gulp-tasks', {recurse: true});

return gulp.task('prod_notify', function () {
    notifier.notify({
        'title': 'finished',
        'message': 'prod code built and copied to ./dist'
    });
});