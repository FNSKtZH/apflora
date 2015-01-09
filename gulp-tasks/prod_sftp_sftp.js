/**
 * beamt die Dateien aus dem dist-Ordner nach apflora.ch
 */

/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var gulp       = require('gulp'),
    sftp       = require('gulp-sftp'),
    requireDir = require('require-dir'),
    sftpPass   = require('../sftpPass.json');

requireDir('../gulp-tasks', {recurse: true});

gulp.task('prod_sftp_sftp', function () {
    //return gulp.src('dist/**/*')
    return gulp.src([
        'dist/*',
        'dist/etc/*',
        'dist/geojson/*',
        'dist/img/*.png',
        'dist/img/*.ico',
        'dist/kml/*',
        'dist/queries/*.js',
        'dist/queries/tree/*.js',
        'dist/src/**/*.js',
        'dist/src/themes/apple/*',
        'dist/src/themes/classic/*',
        'dist/src/themes/default/*',
        'dist/src/themes/default-rtl/*',
        'dist/style/*',
        'dist/style/images/*'
    ])
        .pipe(sftp({
            host: 'apflora.ch',
            port: 31234,
            remotePath: 'apflora',
            user: sftpPass.user,
            pass: sftpPass.pass
        }));
});