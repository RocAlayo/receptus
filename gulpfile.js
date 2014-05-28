/**
 * Created by roc on 22/05/14.
 */
"use strict";

// Include gulp
var gulp = require('gulp'),
// Include Our Plugins
  jshint = require('gulp-jshint'),
  markdox = require('gulp-markdox'),
  rename = require('gulp-rename'),
  jasmine = require('gulp-jasmine');

// Lint Task
gulp.task('lint', function () {
  return gulp.src(['./lib/**/*.js', './spec/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// Get Markdown documentation
gulp.task("doc", function () {
  return gulp.src("./lib/**/*.js")
    .pipe(markdox())
    .pipe(rename({
      extname: ".md"
    }))
    .pipe(gulp.dest("./docs"));
});

// Test it all!
gulp.task("spec", function () {
  return gulp.src("./spec/**/*.spec.js")
    .pipe(jasmine());
});

// Default Task
gulp.task('default', ['lint', 'doc', 'spec']);