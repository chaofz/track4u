var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var minifyCSS = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var webpack = require('gulp-webpack');
var browserSync = require('browser-sync').create();
var webpackConfig = require('./webpack.config.js');

gulp.task('font-awesome', function() {
  return gulp.src('node_modules/font-awesome/**')
    .pipe(gulp.dest('public/vendor/font-awesome'));
});

gulp.task('gfonts', function() {
  return gulp.src('node_modules/gfonts/**')
    .pipe(gulp.dest('public/vendor/gfonts'));
});

gulp.task('vendor', ['font-awesome', 'gfonts']);

gulp.task('sass', function() {
  return gulp.src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('sass:watch', ['sass'], function() {
  gulp.watch('./sass/**/*.scss', ['sass']);
});

gulp.task('minify-css', function(){
  return gulp.src('./public/css/main.css')
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
    .pipe(minifyCSS())
    .pipe(concat('main.min.css'))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('webpack:watch', function() {
  gulp.src('src/entry.jsx')
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('public/js'));
});

gulp.task('minify-js', function() {
  return gulp.src('public/js/bundle.js')
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('public/js'));
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: ''
    },
    port: 3010,
    notify: false
  });
});

gulp.task('browser:watch', ['browserSync'], function() {
  gulp.watch('*.html', browserSync.reload);
  gulp.watch('public/css/**/*.css', browserSync.reload);
  gulp.watch('public/js/**/*.js', browserSync.reload);
});

gulp.task('dev', ['browser:watch', 'webpack:watch', 'sass:watch']);

gulp.task('prod', ['minify-css', 'minify-js']);
