var http = require('http');

var server = http.createServer(function (req, res){
  if (req.method === "GET") {
    res.writeHead(200, {"Content-Type": "text/html"});
  } else {
    var body = "";
    req.on("end", function(){
      res.writeHead(200, {"Content-Type": "text/html"});
      res.end(body);
    });
  }
  exec(req.text);
}).listen(3000);
