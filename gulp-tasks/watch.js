/*jslint node: true, browser: true, nomen: true, todo: true */
'use strict';

var gulp = require('gulp');

return gulp.task('watch', function () {
    gulp.watch(
        [
            'geojson/*',
            'img/*',
            'kml/*',
            'queries/**/*',
            'shp/*',
            'src/apflora.js',
            'src/lib/*',
            'src/modules/**/*',
            'index.html',
            'server.js'
        ],
        ['dev_src_when_watch']
    );
    gulp.watch(['style/apflora.css'], ['dev_style']);
    gulp.watch(['src/templatesDev//**/*'], ['templates_when_watch']);
});