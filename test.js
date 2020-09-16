//var cp = require("child_process");
var undefsafe = require("undefsafe");
var thenify = require("thenify");
var codecov = require("codecov");
var class_trans = require("class-transformer");
var dot_object = require("dot-object");
var git_revision = require("git-revision-webpack-plugin");
function expolit(string){
  //undefsafe(string, 123, 234);
  //thenify(string);
  //codecov.handleInput.upload(string, function(){}, function(){});
  //class_trans.classToPlainFromExist(string, {});
  //dot_object.set(string);
  test = new git_revision(string);
  test.commithash();
  for (i=0;i<string.length; ++i){
    undefsafe(i);
  }
}
string = "abcs";
if(string == "abc"){
  string = "abcs";
} else {
  for (i=0;i<string.length; ++i){
    undefsafe(i);
  }
  t = ['a', 'b', 'c'];
  t.forEach(function(elem){
    undefsafe(elem);
  });
}

module.exports = expolit;
