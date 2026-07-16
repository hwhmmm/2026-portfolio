const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer').default;
const cleanCSS = require('gulp-clean-css');
const browserSync = require('browser-sync').create();

const paths = {
  scss: 'src/scss/**/*.scss',
  scssEntry: 'src/scss/main.scss',
  cssOut: 'dist/css',
  js: 'src/js/**/*.js',
  html: 'index.html'
};

function styles() {
  return src(paths.scssEntry)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(dest(paths.cssOut))
    .pipe(browserSync.stream());
}

function serve() {
  browserSync.init({
    server: { baseDir: './' },
    notify: false,
    open: false
  });

  watch(paths.scss, styles);
  watch([paths.html, paths.js]).on('change', browserSync.reload);
}

const build = series(styles);
const dev = series(styles, serve);

exports.styles = styles;
exports.build = build;
exports.default = dev;
