var path = require('path')
var dir = {
    src: path.join(__dirname, 'pages/'),
    dist: path.join(__dirname, 'pages/')
}

var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var sass = require('gulp-sass');

// 编译pages目录下的scss
gulp.task('copy-scss', function () {
  return gulp.src(dir.src + '**/*.scss')
        // .pipe(sass({outputStyle: 'compact'}).on('error',sass.logError))
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            grid: false
        }))
        .pipe(rename({extname: '.wxss'}))
        .pipe(gulp.dest(dir.dist))
});

// 编译根目录下的scss
gulp.task('copy-root-scss', function () {
  return gulp.src(__dirname + '/*.scss')
        // .pipe(sass({outputStyle: 'compact'}).on('error',sass.logError))
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            grid: false
        }))
        .pipe(rename({extname: '.wxss'}))
        .pipe(gulp.dest(__dirname))
});

gulp.task('watch', function () {
    gulp.watch(dir.src + '**/*.scss', ['copy-scss']);
    gulp.watch(__dirname + '/*.scss', ['copy-root-scss']);
});
gulp.task('default', ['watch', 'copy-scss', 'copy-root-scss']);