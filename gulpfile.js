var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    js_obfuscator = require('gulp-js-obfuscator');

gulp.task('default', function () {
    gulp.src('js/*.js')
        .pipe(uglify({
            ext:{
                src:'.js',
                min:'.js'
            },
        }))
        .pipe(js_obfuscator({}, ["**!/jquery-*.js"]))

        .pipe(gulp.dest('js/'));
});
