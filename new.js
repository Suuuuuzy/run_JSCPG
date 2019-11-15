var cp = require('child_process');
function foo() {
  this.test = "123";
  foo.prototype.action = function() {
    console.log(this.test);
    cp.exec(this.test);
  }
}

var f = new foo();
f.action();
