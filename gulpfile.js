var gulp            = require('gulp');
var clean           = require('gulp-clean');
var rename          = require('gulp-rename');
var plumber         = require('gulp-plumber');
var concat          = require('gulp-concat');
var htmlmin         = require('gulp-htmlmin');
var uglify          = require('gulp-uglify');
var less            = require('gulp-less');
var autoprefixer    = require('gulp-autoprefixer');
var cleanCSS        = require('gulp-clean-css');
var filter          = require('gulp-filter');
var tap             = require('gulp-tap');
var fs              = require("fs");
//var runSequence     = require('run-sequence');
const runSequence = require('gulp4-run-sequence'); // gulp4
var browserSync     = require('browser-sync').create();
var gulpNgConfig    = require('gulp-ng-config');
var addStream       = require('add-stream');

var path = {
    base: {
        app: 'src/',
        dist: 'public/'
    },
    vendor_npm: 'node_modules',
    js: 'src/assets/js',
    js_dest: 'public/assets/js',
    less: 'src/assets/less',
    less_dest: 'public/assets/css',
    html: 'src/assets/views',
    html_dest: 'public',
    images: 'src/assets/img',
    images_dest: 'public/assets/img',
    svg: 'src/assets/svg',
    svg_dest: 'public/assets/svg',
    fonts: 'src/assets/fonts',
    fonts_dest: 'public/assets/fonts'
};

var vendor = {
    js:[
        path.vendor_npm   + '/jquery/dist/jquery.js',
        path.vendor_npm   + '/angular/angular.js',
        path.vendor_npm   + '/angular-ui-router/release/angular-ui-router.js',
        path.vendor_npm   + '/uikit/dist/js/uikit.js',
        path.vendor_npm   + '/uikit/dist/js/uikit-icons.min.js',
        path.vendor_npm   + '/chart.js/dist/Chart.js',
    ],
    less:[
    ]
};

var config = {
    server: {
        baseDir: path.base.dist
    },
    port: 8070,
    html: {
        collapseWhitespace: true
    },
    concat: {newLine: '\n\n/**********************************************************/\n\n'},
    concat_exclude: [],
    less: {
        paths: vendor.less
    }
};

gulp.task('connect', function() {
    browserSync.init(config);
});

gulp.task('js-plugins', function () {
    return gulp.src(vendor.js)
        .pipe(concat('plugins.js', config.concat))
        .pipe(gulp.dest(path.js_dest));
});

gulp.task('js-main-dev', function() {
    var files = [];
    for(var i in config.concat_exclude) {
        files.push('!' + config.concat_exclude[i]);
    }
    files.push(path.js + '/**/*.js');
    return gulp.src(files)
        .pipe(addStream.obj(makeDevConfig()))
        .pipe(addStream.obj(makeVersion()))
        .pipe(concat('main.js', config.concat))
        .pipe(gulp.dest(path.js_dest));
});

gulp.task('js-main-prod', function() {
    var files = [];
    for(var i in config.concat_exclude) {
        files.push('!' + config.concat_exclude[i]);
    }
    files.push(path.js + '/**/*.js');
    return gulp.src(files)
        .pipe(addStream.obj(makeProdConfig()))
        .pipe(addStream.obj(makeVersion()))
        .pipe(concat('main.js', config.concat))
        .pipe(gulp.dest(path.js_dest));
});

gulp.task('js-main-test', function() {
    var files = [];
    for(var i in config.concat_exclude) {
        files.push('!' + config.concat_exclude[i]);
    }
    files.push(path.js + '/**/*.js');
    return gulp.src(files)
        .pipe(addStream.obj(makeTestConfig()))
        .pipe(addStream.obj(makeVersion()))
        .pipe(concat('main.js', config.concat))
        .pipe(gulp.dest(path.js_dest));
});

gulp.task('js-main-pre', function() {
    var files = [];
    for(var i in config.concat_exclude) {
        files.push('!' + config.concat_exclude[i]);
    }
    files.push(path.js + '/**/*.js');
    return gulp.src(files)
        .pipe(addStream.obj(makePreConfig()))
        .pipe(addStream.obj(makeVersion()))
        .pipe(concat('main.js', config.concat))
        .pipe(gulp.dest(path.js_dest));
});

// uglify
gulp.task('js-uglify', function() {
    var files = vendor.js;
    files.push(path.js_dest + '/main-*.js');

    var filter_min = filter(['**', '!' + vendor.js + '/**/*.min.js'], {restore: true});
    return gulp.src(files)
        .pipe(filter_min)
        .pipe(plumber())
        .pipe(uglify())
        .on('error', function (err) { console.log('\x1b[32m', err.toString()); })
        .pipe(plumber.stop())
        .pipe(filter_min.restore)
        .pipe(concat('app.min.js', config.concat))
        .pipe(gulp.dest(path.js_dest))
        .pipe(browserSync.stream());
});

gulp.task('less', function () {
    return gulp.src(path.less + '/main.less')
        .pipe(less())
        .pipe(autoprefixer({browsers: ['last 2 version', '> 5%']}))
        .pipe(gulp.dest(path.less_dest))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest(path.less_dest))
        .pipe(browserSync.stream());
});

var indexHtmlFilter = filter(['**/*', '!**/index.html'], { restore: true });

gulp.task('html', function () {
    return gulp.src(path.html + '/**/*.html')
        .pipe(htmlmin(config.html))
        .pipe(gulp.dest(path.html_dest))
        .pipe(browserSync.stream());
});

gulp.task('images', function() {
    return gulp.src(path.images + '/**')
        .pipe(gulp.dest(path.images_dest))
        .pipe(browserSync.stream());
});

gulp.task('svg', function() {
    return gulp.src(path.svg + '/**')
        .pipe(gulp.dest(path.svg_dest))
        .pipe(browserSync.stream());
});

gulp.task('fonts',function() {
    return gulp.src(path.fonts + '/**')
        .pipe(gulp.dest(path.fonts_dest))
        .pipe(browserSync.stream());
});

// Delete the dist directory
gulp.task('clean', function() {
    return gulp.src(path.base.dist, { allowEmpty: true })
        .pipe(clean());
});

function makeVersion() {
    return gulp.src(path.base.app + '/version.json')
        .pipe(gulpNgConfig('myApp.version'))
}

function makeTestConfig() {
    return gulp.src('./config.test.json')
        .pipe(gulpNgConfig('myApp.config'))
}

function makeProdConfig() {
    return gulp.src('./config.prod.json')
        .pipe(gulpNgConfig('myApp.config'))
}

function makePreConfig() {
    return gulp.src('./config.pre.json')
        .pipe(gulpNgConfig('myApp.config'))
}

function makeDevConfig() {
    return gulp.src('./config.dev.json')
        .pipe(gulpNgConfig('myApp.config'))
}

gulp.task('build-dev', gulp.series('html', 'images', 'fonts', 'svg', 'js-plugins','js-main-dev', 'less', function(done) {
    console.log('\x1b[32m', 'build-dev', '\x1b[0m');
    done();
}));

gulp.task('build-test', gulp.series(['clean', 'html', 'images', 'fonts', 'svg', 'js-plugins', 'js-main-test', 'less']), function(done) {
    console.log('\x1b[32m', 'Build test complete', '\x1b[0m');
    done();
});

gulp.task('build-pre', gulp.series(['clean', 'html', 'images', 'fonts', 'svg', 'js-plugins', 'js-main-pre', 'less']), function(done) {
    console.log('\x1b[32m', 'Build pre complete', '\x1b[0m');
    done();
});

gulp.task('build-prod', gulp.series(['clean', 'html', 'images', 'fonts', 'svg', 'js-plugins', 'js-main-prod', 'js-uglify', 'less']), function(done) {
    console.log('\x1b[32m', 'Build prod complete', '\x1b[0m');
    done();
});

gulp.task('serve', gulp.series(['build-prod', 'connect']), function(done) {
    console.log('\x1b[32m', 'serve Starting server at http://localhost:' + config.port, '\x1b[0m');
    done();
});

gulp.task('serve-dev', gulp.series('build-dev', gulp.parallel('connect', function(done) {
    console.log('\x1b[32m', 'serve-dev Starting server at http://localhost:' + config.port, '\x1b[0m');
    done();
})));

gulp.task('default', gulp.parallel('serve', function(done) {
    gulp.watch(path.base.app + "**/*.*", gulp.series('build-prod'));
    gulp.watch(path.base.dist + "**/*.*").on('change', browserSync.reload);
    done();

}));

gulp.task('dev', gulp.parallel('serve-dev', function(done) {
    gulp.watch([path.base.app + "**/*.js", path.base.app + '/version.json'], gulp.series('js-main-dev'));
    gulp.watch(path.base.app + "**/*.html", gulp.series('html'));
    gulp.watch(path.base.app + "**/*.less", gulp.series('less'));
    gulp.watch(path.base.dist + "**/*.*").on('change', browserSync.reload);
    done();
}));
