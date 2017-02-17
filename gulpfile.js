var gulp = require('gulp');
var ts = require('gulp-typescript');

gulp.task('tsc', function () {
    var tsProject = ts.createProject('tsconfig.json');
    var tsResult = tsProject.src()
        .pipe(tsProject());
    var result = tsResult.js.pipe(gulp.dest('lib'));
    return result;
});