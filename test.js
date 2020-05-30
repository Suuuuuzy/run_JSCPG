//var cp = require("child_process");
var undefsafe = require("undefsafe");
//var thenify = require("thenify");
var codecov = require("codecov");
function expolit(string){
  //undefsafe(string, 123, 234);
  //thenify(string);
    codecov.handleInput.upload(string, function(){}, function(){});
}

module.exports = expolit;
