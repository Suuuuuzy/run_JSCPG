//var cp = require("child_process");
function expolit(string, input, val){
  var inner = string + 123;
  var base = {"basekey": inner};
  eval(base['basekey']);
}
module.exports = expolit;
