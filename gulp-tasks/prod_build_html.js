var gulp = require('gulp')
var minifyHTML = require('gulp-minify-html')

gulp.task('prod_build_html', function () {
  return gulp.src('index.html')
    .pipe(minifyHTML())
    .pipe(gulp.dest('dist'))
})
