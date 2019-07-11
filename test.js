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

string = new String;
String.prototype.s = "str";
var str = string.s

array = new Array(1,2,3);
array_small = [1,2,3];
Array.prototype.arr = "arr"
array_arr = array_small.arr
