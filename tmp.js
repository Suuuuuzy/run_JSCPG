var cp = require("child_process");

function foo() {
  foo.prototype.worker = function(var_test) {
    cp.exec(var_test);
  }
}

module.exports = new foo();
/*
.foo = function(input){
  return new foo(input);
}
*/
