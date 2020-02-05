var fs = require("fs");
var http = require("http");
http.createServer(function(req, res){
  ret = req.url;//fs.readFile(req.url);
  res.write(ret);
  res.end();
}).listen(8080);

