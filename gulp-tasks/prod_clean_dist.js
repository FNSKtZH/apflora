var gulp   = require('gulp'),
    clean  = require('gulp-clean');

gulp.task('prod_clean_dist', function () {
    return gulp.src('dist', {read: false})
        .pipe(clean());
});