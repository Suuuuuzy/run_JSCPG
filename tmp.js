var http = require("http");

var callback = function(req, res) {
  res.end(req.url);
}

http.createServer(callback);
