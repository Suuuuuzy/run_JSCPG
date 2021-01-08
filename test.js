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

  try {
    var inner = 123;
  } catch (error) {
    console.log(error);
  }

}

function pp(a, b, val) {
  var test = {};
  test[a][b] = val;
  return test;
}
module.exports = {
  expolit: expolit,
  pp: pp
}
