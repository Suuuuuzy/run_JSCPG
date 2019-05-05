function funca() {
  var a = 1;
  this.funcb = function() {
    var b = a;
    console.log('test');
  }
  funcc = function() {
    var b = a + 2;
    console.log("funcc");
  }
  a = 2;
}
f = new funca();
var n = f;
n.funcb();
funcc();

