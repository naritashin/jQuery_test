var gulp = require('gulp');
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload;

gulp.task('sass', function() {
  return gulp.src('./src/sass/**/*.scss')
  .pipe(sass())
  .pipe(gulp.dest('./css/'))
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest('./log/'));
});

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: './',
      index: 'index.html'
    }
  });
});

gulp.task('default', ['sass', 'browser-sync'], function() {
  gulp.watch('./src/sass/**/*.scss', ['sass']).on('change', reload);
  gulp.watch('./**/*.html').on('change', reload);
  gulp.watch('./src/javascripts/**/*.js');
})