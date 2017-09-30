'use strict';

const gulp = require('gulp');
const postcss = require('gulp-postcss');
const atimport = require('postcss-import');
const custommedia = require('postcss-custom-media');
const customprops = require('postcss-custom-properties');
const stylelint = require('stylelint');
const reporter = require('postcss-reporter');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const eslint = require('gulp-eslint');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
// const defineTpl = require('gulp-define-golang-template');
const bs = require('browser-sync').create();
const processors = [
        atimport(),
        custommedia(),
        customprops(),
        stylelint(),
        autoprefixer({ browsers: ['last 2 versions', 'android 4.0', 'ios 8.0'] }),
        reporter({ clearMessages: true }),
        cssnano()
      ];

// Browser Sync Setup
gulp.task('bs', () => {
  bs.init({ proxy: 'localhost:8082', open: false });
  bs.watch(['./static/files/**/*', './templates/**/*']).on('change', bs.reload);
});

// Execute Build:CSS
gulp.task('css:link', () => {
  return gulp.src(['./static/assets/css/**/!(_*|app).css'])
    .pipe(postcss(processors))
    .pipe(gulp.dest('./static/files/css/'));
});

// Execute Build:JavaScript
gulp.task('js', () => {
  return gulp.src("./static/assets/js/**/*.js")
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest("./static/files/js/"));
});

gulp.task('js:lint', () => {
  return gulp.src("./static/assets/js/**/*.js")
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

// Execute Build:Images(png, svg, gif, jpg)
gulp.task('img', () => {
  return gulp.src("./static/assets/img/**/*")
    .pipe(imagemin())
    .pipe(gulp.dest("./static/files/img/"));
});

// Rerun the task when a file changes
gulp.task('watch', () => {
  gulp.watch('./static/assets/css/**/*.css', ['css']);
  gulp.watch('./static/assets/js/**/*.js', ['js']);
});

gulp.task('css', ['css:link']);
gulp.task('lint', ['js:lint']);
gulp.task('build', ['css', 'js', 'img']);
gulp.task('default', ['bs', 'css', 'js', 'watch']);
