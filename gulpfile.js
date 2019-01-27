// Load plugins
var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cssnano = require('gulp-cssnano');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var notifier = require('node-notifier');
var nodemon = require('nodemon');
var fs = require('fs');

//notifier.logLevel(0);

// Styles - compile custom Sass
gulp.task('styles', function() {
    return gulp.src([
        'src/sass/main.scss'
    ])
    .pipe(plumber({
        errorHandler: function (err) {
            notifier.notify({
                title: 'Error in style stask',
                message: err.message
            });

            this.emit('end');
        }
    }))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(gulp.dest('public/css'))
    .pipe(cssnano({ zindex: false }))
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('public/css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('public/css'))
    .on('end', function() {
        notifier.notify({
            title: 'Styles task completed',
            message: 'Success'
        });
    });
});

// Scripts - compile custom js
gulp.task('scripts', function() {
    return gulp.src([
        'src/js/scripts.js'
    ])
    .pipe(plumber({
        errorHandler: function (err) {
            notifier.notify({
                title: 'Error in scripts task',
                message: err.message
            });

            this.emit('end');
        }
    }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(babel({
        presets: ['env']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('public/js'))
    .on('end', function() {
        notifier.notify({
            title: 'Scripts task completed',
            message: 'Success'
        });
    });
});

// Start - starts the server and restarts it on file change
gulp.task('start', function() {
    nodemon({
        script: 'server.js',
        ext: 'js',
        watch: ['server/*', 'server.js']
    })
});

// Watch - watcher for changes in scss and js files: 'gulp watch' will run these tasks
gulp.task('watch', function() {
    // Watch .scss files
    gulp.watch('src/sass/**/*.scss', ['styles']);

    // Watch .js files
    gulp.watch('src/js/scripts.js', ['scripts']);
});

// Default - runs the scripts, styles and watch tasks: 'gulp' will run this task
gulp.task('default', ['styles', 'scripts', 'start', 'watch'])

