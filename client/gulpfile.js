var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var webpack = require('webpack-stream');
var webpackConfig = require('./webpack.config.js');

gulp.task('sass', function() {
  gulp.src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('sass:watch', ['sass'], function() {
  gulp.watch('./sass/**/*.scss', ['sass']);
});

gulp.task('css', ['sass'], function(){
  gulp.src('./dist/css/main.css')
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
    .pipe(minifyCSS())
    .pipe(concat('main.min.css'))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('webpack', function() {
  return gulp.src('src/index.jsx')
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('js', ['webpack'], function() {
  gulp.src('./dist/js/bundle.js')
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('default', ['sass:watch', 'webpack']);

gulp.task('prod', ['css', 'js']);
