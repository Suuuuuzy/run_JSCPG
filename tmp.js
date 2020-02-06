var fs = require("fs");
var http = require("http");
http.createServer(function(req, res){
  console.log('url', req.url);
  ret = req.url;//fs.readFile(req.url);
  res.write(ret);
  res.end();
}).listen(8080);

