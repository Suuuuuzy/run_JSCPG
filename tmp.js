var cp = require("child_process");

function foo(var_test) {
  this.options = var_test;

  foo.prototype.action = function() {
    const self = this;
    cp.execSync('adn ' + self.options);
  }
}

exports.foo = function(input){
  return new foo(input);
}
