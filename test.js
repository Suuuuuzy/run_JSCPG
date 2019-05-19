var exec = require('child_process').exec
  , fs = require('fs')
  , path = require('path')
  , exists = fs.existsSync || path.existsSync
  , os = require('os', 'fillout')
  , quote = JSON.stringify
  , cmd;

function funca() {
  var a = 1;
  this.funcb = function(a) {
    var b = a;
    console.log('test');
  }
  funcc = function() {
    var b = a + 2;
    console.log("funcc");
  }
  a = 2;
}

function test(cmd){
  exists("wtf");
  args = [cmd.pkg];
  f = new funca();
  var n = f;
  f.first();
  a = 1;
  args.push(n);
  exec(a, args)
  if (a == 1) {
    n.funcb(a);
  }
}

test("");
