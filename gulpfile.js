
  const gulp           = require('gulp');
  const sass           = require('gulp-sass');
  const cleancss       = require('gulp-clean-css');
  const imagemin       = require('gulp-imagemin');
  const pngquant       = require('imagemin-pngquant');
  const jpegRecompress = require('imagemin-jpeg-recompress');
  const watch          = require('gulp-watch');

  const PATHS = {
    src : {
      scss   : './scss/**/*.scss',
      images : {
        jpg       : './images_src/**/*.+(jpg|jpeg|JPG|JPEG)',
        gifpngsvg : './images_src/**/*.+(png|PNG|gif|GIF|svg|SVG)'
      }
    },
    dest : {
      css    : './',
      images : './images'
    }
  };

  function scss(){
    return gulp.src(PATHS.src.scss)
      .pipe(sass()) // Compile SASS
      .pipe(cleancss()) // Minify
      .pipe(gulp.dest(PATHS.dest.css));
  }

  function jpeg(){
    return gulp.src(PATHS.src.images.jpg)
      .pipe(imagemin([
        jpegRecompress({
          loops: 4,
          min: 50,
          max: 95,
          quality: 'high'
        })
      ]))
      .pipe(gulp.dest(PATHS.dest.images));
  }

  function pnggifsvg(){
    return gulp.src(PATHS.src.images.gifpngsvg)
      .pipe(imagemin({
        svgoPlugins: [{ removeViewBox: false }],
        use: [pngquant()]
  		}))
      .pipe(gulp.dest(PATHS.dest.images));
  }

  function watchFiles(){
    watch(PATHS.src.scss, gulp.series(scss));
    watch(PATHS.src.images.jpg, gulp.series(jpeg));
    watch(PATHS.src.images.gifpngsvg, gulp.series(pnggifsvg));
  }

  exports.default = gulp.series(gulp.parallel(
    scss,
    jpeg,
    pnggifsvg),
    watchFiles
  );