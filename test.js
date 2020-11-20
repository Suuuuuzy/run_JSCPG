var cp = require("child_process");
function expolit(string, input, val){
  var inner = string + 123;
  var base = new Object();
  base[string][input] = val;
  cp.exec(inner);
}
function foo(foo_input) {
  cp.exec(foo_input);
}
module.exports = expolit;
