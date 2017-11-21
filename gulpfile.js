const gulp = require('gulp');
const browserify = require('gulp-browserify');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const lreload = require('gulp-livereload');
const del = require('del');
const concat = require('gulp-concat');


// Some project paths
const entryFile = './src/emoji-tetrominos.js';
const filesToWatch = [
  './*.js',
  './**/*.js',
  '!./build/**/*',
  '!./node_modules/**/*'
];
const buildDir = './public/scripts';



// Some strings for task names
const TASKS = { BUILD: 'build', CLEAN: 'clean', WATCH: 'watch' };


/*

  Clean the build directory

*/
gulp.task(TASKS.CLEAN, function() {
  return del.sync([ `${buildDir}/emoji-tetrominos.*` ]);
});


/*

  Transpile the code

*/
gulp.task(TASKS.BUILD, [ TASKS.CLEAN ], function() {
  // browserify needs a single entry point
  return gulp.src(entryFile)
    .pipe(sourcemaps.init())
    .pipe(browserify({
      insertGlobals : true,
      debug : true
    }))
    .on('error', ({ stack }) =>
      console.error(stack)
    )
    .pipe(
      babel({ presets: [ 'stage-3' ] })
    )
    .pipe(concat('emoji-tetrominos.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(buildDir))
    .pipe(lreload());
});


/*

  Rerun the task when a file changes

*/
gulp.task(TASKS.WATCH, function() {
  lreload.listen();
  return gulp.watch(filesToWatch, [ TASKS.BUILD ]);
});



// The main task executed when running command: `gulp`
gulp.task('default', [ TASKS.BUILD, TASKS.WATCH ]);
