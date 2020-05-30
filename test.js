//var cp = require("child_process");
var undefsafe = require("undefsafe");
var thenify = require("thenify");
var codecov = require("codecov");
var class_trans = require("class-transformer");
var dot_object = require("dot-object");
function expolit(string){
  //undefsafe(string, 123, 234);
  //thenify(string);
  //codecov.handleInput.upload(string, function(){}, function(){});
  //class_trans.classToPlainFromExist(string, {});
  dot_object.set(string);
}

module.exports = expolit;
