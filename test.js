//var cp = require("child_process");
function expolit(string, input, val){
  var inner = string + 123;
  var base = {"basekey": inner};

  for (var key in base) {
    var nothing = key + base[key];
    eval(base[key]);
  }

  if (inner == "bad") {
    var nothing = base['basekey'] + "abc";
    eval(base['basekey']);
  } else {
    var link = inner + "123";
    eval(inner);
  }
}
module.exports = expolit;
