'use strict'

var gulp = require('gulp')

gulp.task('prod_copy_src_to_dist', function () {
  return gulp.src([
    'src/jquery.jstree.js',
    'src/list.js'
  ])
    .pipe(gulp.dest('dist/src'))
})
