var cp = require("child_process");

function foo(var_test) {
  var test123 = var_test.real;
  var cb = var_test;
  cb(123);
  cp.execSync('adn ' + test123);
}

module.exports = foo;
/*
.foo = function(input){
  return new foo(input);
}
*/
