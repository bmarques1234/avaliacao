var gulp = require('gulp');
var sass = require('gulp-sass');
var jsonServer = require('gulp-json-srv');

gulp.task('sass', function () {
  gulp.src(['public/scss/*.scss'])
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(gulp.dest('public/css/'));
});

gulp.task('default', function () {
 //gulp.start('minify-html');
  gulp.start('sass');
  jsonServer.start({
    data: 'product.json',
  });
});