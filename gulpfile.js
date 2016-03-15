var gulp = require('gulp');
var webserver = require('gulp-webserver'); //웹서버처럼
var concat = require('gulp-concat'); // 파일병합을 위한 플러인
var uglify = require('gulp-uglify'); // 파일압축
var minifyhtml = require('gulp-minify-html');
var sass = require('gulp-sass');
var uglifycss = require('gulp-uglifycss');
var livereload = require('gulp-livereload');
var jshint = require('gulp-jshint');
var template = require('gulp-template');


var src = 'public/src';
var dist = 'public/dist';

var paths = {
	js: src + '/js/*.js',
	scss: src + '/scss/*.scss',
	html: src + '/**/*.html'
};

gulp.task('server', function(){
	return gulp.src(dist + '/')
	.pipe(webserver());
});

//자바스크립트 파일을 하나로 
gulp.task('combine-js', function(){
	return gulp.src(paths.js)
	.pipe(concat('script.js'))
	.pipe(uglify())
	.pipe(gulp.dest(dist + '/js'));
});

// sass 파일을 css로
gulp.task('compile-sass', function(){
	return gulp.src(paths.scss)
	.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
	.pipe(sass())
	.pipe(gulp.dest(dist+'/css'));
})

gulp.task('css', function() {
    return gulp.src(dist+'/css')
        .pipe(concat('all.min.css'))
        .pipe(uglifycss({
			"maxLineLen": 80,
			"uglyComments": true
		}))
        .pipe(gulp.dest(dist+'a'));
});


// html파일을 압축
gulp.task('compress-html', function(){
	return gulp.src(paths.html)
	.pipe(minifyhtml())
	.pipe(gulp.dest(dist+'/'));
});

// 파일 변경 감지 및 브라우저 재시작
gulp.task('watch', function(){
	livereload.listen();
	gulp.watch(paths.js, ['combine-js']);
	gulp.watch(paths.scss, ['compile-sass']);
	gulp.watch(paths.html, ['compress-html']);
	gulp.watch(dist + '/**').on('change', livereload.changed);
})

gulp.task('hello',function(){
	return console.log('hello world!');
});

gulp.task('world',['hello'], function(){
	return console.log('you');
});


gulp.task('js:hint', function () {
    gulp
        .src(['src/js/index.js', 'src/js/first.js', 'src/js/second.js'])
        .pipe(jshint())
        .pipe(jshint.reporter());
});

gulp.task('default', [
	'server', 
	'combine-js',
	'compile-sass',
	'compress-html',
	'watch',
	'css'	],
	function(){
		return gulp.src(paths.html)
		.pipe(template({name:'seugho'}))
		.pipe(gulp.dest(dist+'/'));
	}
);

 
