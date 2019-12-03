var cp = require("child_process");
/*
var foo = function() {
  cp.exec("ls", function(input){
    console.log(input);
  })
}
*/

var foo = exports.foo = function (){
  console.log(123);
}
