
  const gulp           = require('gulp');
  const sass           = require('gulp-sass');
  const autoprefixer   = require('gulp-autoprefixer');
  const cleancss       = require('gulp-clean-css');
  const imagemin       = require('gulp-imagemin');
  const pngquant       = require('imagemin-pngquant');
  const jpegRecompress = require('imagemin-jpeg-recompress');
  const watch          = require('gulp-watch');

  const paths = {
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

  gulp.task('scss', function(){
    return gulp.src(paths.src.scss)
      .pipe(sass()) // Compile SASS
      .pipe(autoprefixer()) // CSS Vendor prefixes
      .pipe(cleancss()) // Minify
      .pipe(gulp.dest(paths.dest.css));
  });

  gulp.task('jpeg', function(){
    return gulp.src(paths.src.images.jpg)
      .pipe(jpegRecompress({loops: 3, quality:'high'})())
      .pipe(gulp.dest(paths.dest.images));
  });
  gulp.task('pnggifsvg', function(){
    return gulp.src(paths.src.images.gifpngsvg)
      .pipe(imagemin({
  			svgoPlugins : [{ removeViewBox : false }],
        use         : [pngquant()]
  		}))
      .pipe(gulp.dest(paths.dest.images));
  });

  gulp.task('watch', function(){
    watch(paths.src.scss, function(){ gulp.start('scss'); });
    watch(paths.src.images.jpg, function(){ gulp.start('jpeg'); });
    watch(paths.src.images.gifpngsvg, function(){ gulp.start('pnggifsvg'); });
  });

  gulp.task('default', [
    'scss',
    'jpeg',
    'pnggifsvg',
    'watch'
  ]);
