var exec = require('child_process')
  //.exec
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

f = new funca();
a = 1;
if (a == 1) {
  n.funcb(a)
}
var n = f;
funcc();
f.funcb(2);

