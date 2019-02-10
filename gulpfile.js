var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require("gulp-sourcemaps");
var babel = require("gulp-babel");
var concat = require("gulp-concat");
var webserver = require('gulp-webserver');


gulp.task('sass', function() {
  return gulp.src('app/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('dist'))
})

gulp.task('watch', function() {
  gulp.watch('app/scss/**/*.scss', gulp.series('sass'));
})

gulp.task('babel', function() {
  return gulp.src('app/js/*.js')
  .pipe(sourcemaps.init())
  .pipe(babel())
  .pipe(concat("all.js"))
  .pipe(sourcemaps.write("."))
  .pipe(gulp.dest("dist"));
})

gulp.task('webserver', function() {
  gulp.src('./')
    .pipe(webserver({
      livereload: true,
      directoryListing: true,
      open: true
    }));
});
