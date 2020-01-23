var http = require("http");
function start(path){
  http.createServer(function(req, res){
    var url = req.url;
    res.write(url);
  });
}

module.exports = {
  start
}
