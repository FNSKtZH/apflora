var babel = require('gulp-babel')
var gulp = require('gulp')
var source = require('vinyl-source-stream')

gulp.task('browserify', function () {
  return gulp.src('./src/apflora.js')
    .pipe(babel())
    // Pass desired output filename to vinyl-source-stream
    .pipe(source('apflora_browserified.js'))
    // Start piping stream to tasks!
    .pipe(gulp.dest('./src'))
})
