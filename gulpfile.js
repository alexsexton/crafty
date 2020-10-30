// Gulp (4) configuration

// Modules
const gulp = require('gulp')
const newer = require('gulp-newer')

// Clean
const del = require('del')

// Optimise images and SVG
const imagemin = require('gulp-imagemin')
const svgmin = require('gulp-svgmin')

// JS Tasks
const babel = require('gulp-babel')
const concat = require('gulp-concat')
const stripdebug = require('gulp-strip-debug')
const terser = require('gulp-terser')

// Sass Modules
const sass = require('gulp-sass')
const postcss = require('gulp-postcss')
const assets = require('postcss-assets')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')

var folder = {
  src: 'templates/assets/',
  build: 'web/static/'
}

// Clean
gulp.task('clean', function () {
  return del(folder.build + 'styles.css', folder.build + 'main.js', folder.build + 'main.min.js')
})

// gulp.task('clean_js', function () {
//   return del(folder.build + 'main.js', folder.build + 'main.min.js')
// })

// image processing
gulp.task('images', function () {
  const out = folder.build
  return gulp.src(folder.src + 'images/*')
    .pipe(newer(out))
    .pipe(imagemin({ optimizationLevel: 5 }))
    .pipe(gulp.dest(out))
})

// SVG min
gulp.task('svgmin', function () {
  const out = folder.build
  return gulp.src(folder.src + 'images/*')
    .pipe(svgmin())
    .pipe(gulp.dest(out))
})

// CSS processing
gulp.task('css', gulp.series('clean', 'images', function () {
  const postCssOpts = [
    assets({ loadPaths: ['assets/'] }),
    autoprefixer
  ]
  postCssOpts.push(cssnano)

  return gulp.src(folder.src + 'scss/main.scss')
    .pipe(sass({
      outputStyle: 'nested',
      imagePath: 'images/',
      precision: 3,
      errLogToConsole: true
    }))
    .pipe(postcss(postCssOpts))
    .pipe(gulp.dest(folder.build))
}))

// Babel processing
gulp.task('babel', gulp.series(function (done) {
  gulp.src([
    folder.src + 'js/lib/*',
    folder.src + 'js/*'
  ])
    .pipe(babel())
    .pipe(concat('main.js'))
    .pipe(gulp.dest(folder.build))
  done()
}))

// JavaScript processing
gulp.task('js', gulp.series('babel', function () {
  let jsbuild = gulp.src([
    folder.src + 'js/lib/*',
    folder.src + 'js/main.js'
  ]) // <- Multiple files need to go in an array
    .pipe(babel())
    .pipe(concat('main.min.js'))

  jsbuild = jsbuild
    .pipe(stripdebug())
    .pipe(terser())

  return jsbuild.pipe(gulp.dest(folder.build))
}))

// run all tasks
gulp.task('run', gulp.series('clean', 'images', 'css', 'babel', 'js'))

// watch for changes
gulp.task('watch', gulp.series('run', function () {
  // image changes
  gulp.watch(folder.src + 'images/**/*', gulp.series('images'))
  // javascript changes
  gulp.watch(folder.src + 'js/**/*', gulp.series('babel', 'js'))
  // css changes
  gulp.watch(folder.src + 'scss/**/*', gulp.series('css'))
}))

// default task
gulp.task('default', gulp.series('run'))
