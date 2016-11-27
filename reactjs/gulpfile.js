var gulp = require('gulp');
var gulpUtil = require('gulp-util');
var run = require('gulp-run');
var rt = require('gulp-react-templates');

gulp.task('start', function() {
   return run('npm run start').exec();
});

gulp.task('minify-js-css', function() {
    return run('npm run build').exec();
});

gulp.task('minify-template', function() {
    gulp.src('./src/*.rt')
        .pipe(rt({modules: 'amd'}))
        .pipe(gulp.dest('./dist'));
});

gulp.task('build', ['minify-js-css', 'minify-template']);

gulp.task('default', ['start', 'build']);

