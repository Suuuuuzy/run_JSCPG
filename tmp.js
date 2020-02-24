var express = require("express");
var app = express();
var fs = require("fs");
app.get("./", function(req, res){
  tryRun(req.path, req, res);
})

function tryRun(page, req, res) {
  fs.readFile(page, function(err, data){
    res.end(data);
  })
}
