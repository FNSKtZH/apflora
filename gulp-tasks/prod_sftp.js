/**
 * beamt die Dateien aus dem dist-Ordner nach apflora.ch
 */

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var gulp       = require('gulp'),
    requireDir = require('require-dir');

requireDir('../gulp-tasks', {recurse: true});

return gulp.task('prod_sftp', ['prod_sftp_sftp'], function () {
    gulp.start('prod_clean_dist');
});