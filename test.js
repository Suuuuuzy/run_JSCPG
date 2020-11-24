//var cp = require("child_process");
function expolit(string, input, val){
  var inner = string + 123;
  var base = {"basekey": inner};

  for (var key in base) {
    eval(base[key]);
  }

  if (inner == "bad") {
    eval(base['basekey']);
  } else {
    eval(inner);
  }
}
module.exports = expolit;
