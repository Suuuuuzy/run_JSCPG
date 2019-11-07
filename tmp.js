var http = require("http");
//function parse(value){
//  return value;
//}

var callback = function(req, res) {
  var pathname = parse123(req.url);
  pathname = decode(pathname.split('+'));//.join(' '));
  res.end(pathname);
}

http.createServer(callback);
