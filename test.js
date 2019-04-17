var funca = function() {
  var a = 1;
  this.funcb = function() {
    console.log('test');
  }
  this.funcc = function() {
    console.log("funcc");
  }
}
f = new funca();

