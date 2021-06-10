let project = require('path').basename(__dirname);
let source = "src";

let path = {
  build: {
    html: project + "/",
    css: project + "/css/",
    js: project + "/js/",
    img: project + "/img/",
    fonts: project + "/fonts/",
  },
  src: {
    html: [source + "/*.html", '!' + source + "/_*.html"],
    css: source + "/scss/style.scss",
    js: source + "/js/script.js",
    img: source + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
    fonts: source + "/fonts/*.ttf",
  },
  watch: {
    html: source + "/**/*.html",
    css: source + "/scss/**/*.scss",
    js: source + "/js/**/*.js",
    img: source + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
  },
  clean: "./" + project + "/"
};

let {src, dest} = require('gulp'),
  gulp = require('gulp'),
  browsersync = require('browser-sync').create(),
  fileinclude = require('gulp-file-include'),
  del = require('del'),
  scss = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  group_media = require('gulp-group-css-media-queries'),
  clean_css = require('gulp-clean-css'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify-es').default,
  imagemin = require('gulp-imagemin'),
  webp = require('gulp-webp'),
  webphtml = require('gulp-webp-html'),
  webpcss = require('gulp-webpcss'),
  svgSprite = require('gulp-svg-sprite'),
  ttf2woff = require('gulp-ttf2woff'),
  ttf2woff2 = require('gulp-ttf2woff2');
  fonter = require('gulp-fonter');

function browserSync(params) {
  browsersync.init({
    server: {
      baseDir: "./" + project + "/"
    },
    port: 3000,
    notify: false
  })
};

function html() {
  return src(path.src.html)
    .pipe(fileinclude())
    .pipe(webphtml())
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream())
};

function css() {
  return src(path.src.css)
  .pipe(
    scss({
      outputStyle: "expanded"
    })
  )
  .pipe(group_media())
  .pipe(
    autoprefixer({
      overrideBrowserslist: ['last 5 versions'],
      cascade: true
    })
  )
  .pipe(webpcss())
  .pipe(dest(path.build.css))
  .pipe(clean_css())
  .pipe(
    rename({
      extname: '.min.css'
    })
    )
  .pipe(dest(path.build.css))
  .pipe(browsersync.stream())
};

function js() {
  return src(path.src.js)
    .pipe(fileinclude())
    .pipe(dest(path.build.js))
    .pipe(uglify())
    .pipe(
      rename({
        extname: '.min.js'
      })
      )
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream())
};

function images() {
  return src(path.src.img)
    .pipe(
      webp({
        quality: 70
      })
    )
    .pipe(dest(path.build.img))
    .pipe(src(path.src.img))
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }],
        interlaced: true,
        optimizationLevel: 3 // 0 to 7
      })
    )
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream())
};

function fonts(params) {
  src(path.src.fonts)
    .pipe(ttf2woff())
    .pipe(dest(path.build.fonts));
  return src(path.src.fonts)
    .pipe(ttf2woff2())
    .pipe(dest(path.build.fonts))
};

gulp.task('otf2ttf', function () {
  return src([source + '/fonts/*.otf'])
    .pipe(fonter({
      formats: ['ttf']
    }))
    .pipe(dest(source + '/fonts/'));
})

gulp.task('svgSprite', function () {
  return gulp.src([source + '/iconsprite/*.svg'])
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: '../icons/icons.svg',
          example: true
        }
      },
    }
    ))
    .pipe(dest(path.build.img))
})

function watchFiles(params) {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.js], js);
  gulp.watch([path.watch.img], images);
};

function clean(params) {
  return del(path.clean);
};

let build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts));
let watch = gulp.parallel(watchFiles, build, browserSync);

exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;