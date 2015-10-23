'use strict';

var gulp = require('gulp');
var watch = require('gulp-watch');
var imagemin = require('gulp-imagemin');
var newer = require('gulp-newer');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var svgmin = require('gulp-svgmin');
var sass = require('gulp-sass');
var cssmin = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var jshint = require('gulp-jshint');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create();

// paths
var imgSrc = './images/src/*';
var imgDest = './images';
var svgSrc = './images/svg-src/*';
var svgDest = './images';
var sassSrc = './scss/styles.scss';
var sassDest = './css';

gulp.task('sass', function () {
gulp.src(sassSrc)
  .pipe(sass({
    errLogToConsole: true
    }))
  .pipe(autoprefixer('last 2 version'))
  .pipe(gulp.dest(sassDest));
});

gulp.task('cssmin', function() {
  return gulp.src('./css/styles.css')
    .pipe(cssmin())
    .pipe(rename('styles.min.css'))
    .pipe(gulp.dest(sassDest));
});

// add image minify task
gulp.task('imagemin', function() {
  return gulp.src(imgSrc)
    .pipe(newer(imgSrc))
    .pipe(imagemin())
    .pipe(gulp.dest(imgDest));
});

// add svg minify task
gulp.task('svgmin', function() {
  return gulp.src(svgSrc)
    .pipe(newer(svgSrc))
    .pipe(svgmin())
    .pipe(gulp.dest(svgDest));
});

// Run tasks without watching.
gulp.task('build', function(callback) {
  runSequence('sass', 'imagemin', 'svgmin', 'cssmin', callback);
});

gulp.task('browser-sync', function() {
  browserSync.init(["css/*.css", "js/*.js"], {
    // If running on host (not in guest VM), enable proxy mode.
    proxy: "devstack.vm",
    reloadDelay: 300, // default is 2000 (2 seconds)
    injectChanges: true, // Inject CSS changes
    // injectChanges: false, // Don't try to inject, just do a page refresh
  });
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(imgSrc, ['imagemin']);
  gulp.watch(svgSrc, ['svgmin']);
  gulp.watch(sassSrc, ['sass', 'cssmin']);
});

gulp.task('serve', function(callback) {
  runSequence('build', 'browser-sync', 'watch', callback);
});

gulp.task('default', function(callback) {
  runSequence('build', 'watch', callback);
});
