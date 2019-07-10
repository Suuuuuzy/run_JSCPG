var res = new test();
console.log(res);
function test(){
  var a = new console();
  if (a == 1) {
    a = 2; 
  }
  var b = a;
  return b;
}

(function () {
  var x = "Hello!!";  // I will invoke myself
})();

test.prototype.pro = "Proto";
var ret = res.pro
