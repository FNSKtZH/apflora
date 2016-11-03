'use strict'

var gulp = require('gulp')
var uglify = require('gulp-uglify')
var concat = require('gulp-concat')
var pump = require('pump')

gulp.task('prod_build_src', function (cb) {
  pump(
    [
      gulp.src([
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
      ]),
      concat('apflora_built.js'),
      uglify(),
      gulp.dest('./src'),
      gulp.dest('./dist/src')
    ],
    cb
  )
})
