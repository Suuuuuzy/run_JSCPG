function foo() {
  this.test = "123";
  this.action = function() {
    const self = this;
    console.log(self.test);
  }
}

var f = new foo();
f.action();
