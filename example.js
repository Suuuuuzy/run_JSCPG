function foo(var_a) {
  var test = "test";
  this.a = var_a;
}
var a = 1;
foo(a);
var f = new foo('123');
var fa = f;
exec(fa.a);
