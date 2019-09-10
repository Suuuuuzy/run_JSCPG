var a = function(test_inner_a) {
  var inner_a = test_inner_a; 
  var inner_b = 2;
  this.c = 3;
  this.b = function() {
    exec(inner_a);
  }
}

var test_inner_a = "test";
var test_a = new a(test_inner_a);
test_a.b();

if(test_a == 1){
  test_ba = 2;
} else {
  test_ca = 3;
}
return a;
