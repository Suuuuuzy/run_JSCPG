var cp = require("child_process");
function foo(var_test) {
  var t = var_test;
  cp.exec(t);
}

exports.foo = function(){
  return new foo();
}
