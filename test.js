//var cp = require("child_process");
function expolit(string, input, val){
  var inner = string + 123;
  var base = {"basekey": "baseVal"};
  base[string] = {}
  base[string][input] = val;
  //cp.exec(inner);
}
module.exports = expolit;
