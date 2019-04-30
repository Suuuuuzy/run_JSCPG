var funca = function() {
  var a = 1;
  this.funcb = function() {
    console.log('test');
  }
  this.funcc = function() {
    var b = a + 2;
    console.log("funcc");
  }
  a = 2;
}
f = new funca();
var n = f;
n.funcb();
funca();

