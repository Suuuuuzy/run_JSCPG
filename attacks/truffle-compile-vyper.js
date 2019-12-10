var test = require("truffle-compile-vyper");
var opts = {
  "paths": [
    "; touch Song ;/a.vy"],
  "compilers": {'vyper': "none"}
}
test(opts, function(){});
