'use strict';

var gulp        = require('gulp'),
    requireDir  = require('require-dir'),
    runSequence = require('run-sequence');

requireDir('../gulp-tasks', {recurse: true});

return gulp.task('templates_when_watch', function () {
    runSequence(
        'templates',
        'browserify',
        'dev_notify'
    );
});