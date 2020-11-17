var cp = require("child_process");
function expolit(string){
  var inner = string + 123;
  cp.exec(inner);
}
function foo(foo_input) {
  cp.exec(foo_input);
}

module.exports = {
  expolit,
  foo
}

