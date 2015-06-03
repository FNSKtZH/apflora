'use strict'

var gulp = require('gulp'),
  concat = require('gulp-concat-sourcemap')

gulp.task('dev_src', function () {
  return gulp.src([
    'src/jquery-ui.js',
    'src/jquery.ui.touch-punch.js',
    'src/jquery.cookie.js',
    'src/jquery.hotkeys.js',
    'src/hammer.js',
    'src/jquery.hammer.js',
    'src/markerclusterer.js',
    'src/markerwithlabel.js',
    'src/ruler.js',
    'src/jsuri.js',
    'src/jquery.qtip.js',
    'src/jquery.fileDownload.js',
    'src/xlsx.js',
    'src/FileSaver.js',
    'src/canvas-toBlob.js',
    'src/apflora_browserified.js',
    'src/underscore.js',
    'src/handlebars.js',
    'src/list.js'
  ])
    .pipe(concat('apflora_built.js'))
    .pipe(gulp.dest('./src'))
})
